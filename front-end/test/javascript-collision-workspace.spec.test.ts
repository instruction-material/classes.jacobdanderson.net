import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey,javascriptCourseResource } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import { clearLocalPythonProjects,createPythonIdeProject,loadLocalPythonProjectsAsync,loadPythonIdeStarterFilesFromGitHub,saveLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
const fixture=JSON.parse(readFileSync(resolve("../test/fixtures/javascript-collision-sources.json"),"utf8"));
const sha=(value:string)=>createHash("sha256").update(value).digest("hex");
afterEach(async()=>{vi.unstubAllGlobals();await clearLocalPythonProjects();});
for(const resource of fixture.resources){
    it("imports,saves,reopens and exports all seven "+resource.project+"/"+resource.role+" files",async()=>{
        vi.stubGlobal("crypto",webcrypto);
        const prefix="/course-assets/javascript-level-2/";
        const requests:string[]=[];
        vi.stubGlobal("fetch",vi.fn(async(url:string,options:RequestInit)=>{
            expect(url.startsWith(prefix)).toBe(true);
            expect(options).toMatchObject({credentials:"omit",redirect:"error"});
            requests.push(url);
            return new Response(readFileSync(resolve("public/course-assets/javascript-level-2",url.slice(prefix.length))));
        }));
        const files=await loadPythonIdeStarterFilesFromGitHub(resource.urls[0],"web");
        expect(requests).toHaveLength(7);
        for(const file of files){
            const expected=resource.files.find((r:{name:string})=>r.name===file.name);
            expect(file.content).toBe(fixture.files[resource.project][resource.role][file.name]);
            expect(sha(file.content)).toBe(expected.sha256);
        }
        const key=javascriptCourseProjectKey(fixture.courseId,resource.itemId,resource.role,resource.urls[0]);
        for(const alias of resource.urls)expect(javascriptCourseProjectKey(fixture.courseId,resource.itemId,resource.role,alias)).toBe(key);
        const earlier=createPythonIdeProject("web",{files:[{name:"index.html",content:"Earlier work",encoding:"text"}],courseID:fixture.courseId,courseProjectKey:key+":earlier"});
        const project=createPythonIdeProject("web",{files,courseID:fixture.courseId,courseProjectKey:key,starterUrl:resource.urls[0]});
        project.files.find(f=>f.name==="README.md")!.content+="\\nSaved boundary observations.\\n";
        saveLocalPythonProjects([earlier,project]);
        const reopened=await loadLocalPythonProjectsAsync();
        expect(reopened.find(p=>p._id===earlier._id)).toEqual(earlier);
        const saved=reopened.find(p=>p._id===project._id)!;
        expect(saved.files).toEqual(project.files);
        const archive=unzipSync(await createProjectArchive(saved));
        expect(Object.keys(archive)).toHaveLength(7);
        for(const file of saved.files){
            const name=Object.keys(archive).find(n=>n.endsWith("/"+file.name))!;
            expect(strFromU8(archive[name])).toBe(file.content);
        }
    });
}
for(const role of ["learner","instructor"]){
    it("retains all three core identities,complete guidance and correct source roles for "+role,async()=>{
        setActivePinia(createPinia());
        if(role==="instructor")useAppStore().setCurrentTutor({_id:"collision-tutor",name:"Tutor",email:"tutor@example.invalid",age:30,state:"GA",usersOfTutorLength:0,coursePermissions:[fixture.courseId],editTutors:false,saveEdit:"Save"});
        const course=(await useCoursesStore().loadCourseById(fixture.courseId))!;
        const module=course.modules.find(m=>m.id===fixture.moduleId)!;
        for(const project of fixture.projects){
            const item=module.curriculum.find(i=>i.id===project.itemId)!;
            expect(item.title).toBe(project.title);
            expect(item.learningPath).toBe("core");
            expect(item.content).toContain("CASES.md");
            expect(item.content).toContain("Open index.html");
            expect(javascriptCourseResource(item.projectLink!)?.project).toBe(project.project);
            const reference=fixture.resources.find((r:{project:string;role:string})=>r.project===project.project&&r.role==="reference");
            expect(item.solutionLink).toBe(role==="instructor"?reference.urls[0]:undefined);
        }
    });
}
function program(source:string,random=0.5){
    let tick=()=>{};
    const canvas={width:0,height:0,getContext:()=>ctx,setAttribute:()=>{}};
    const ctx={fillStyle:"",font:"",textAlign:"",beginPath(){},arc(){},fill(){},closePath(){},clearRect(){},fillRect(){},fillText(){}};
    const math=Object.create(Math);math.random=()=>random;
    const scope=createContext({document:{getElementById:()=>canvas},Math:math,console:{log(){}},setInterval:(callback:()=>void)=>{tick=callback;}});
    runInContext(source,scope);
    return {scope,canvas,ctx,tick:()=>tick(),read:(expression:string)=>runInContext(expression,scope)};
}
it("reproduces the original circle boundary/vertical mismatch and verifies corrected inclusive2D contact",()=>{
    const original=fixture.projects.find((p:{project:string})=>p.project==="circles-collide").originals[1].source.javascript;
    const old=program(original);
    for(let i=0;i<205;i++)old.tick();
    expect(old.ctx.fillStyle).toBe("black");
    const current=program(fixture.files["circles-collide"].reference["script.js"]);
    for(let i=0;i<204;i++)current.tick();
    expect(current.ctx.fillStyle).toBe("black");current.tick();expect(current.ctx.fillStyle).toBe("blue");
    for(let i=205;i<246;i++)current.tick();
    expect(current.ctx.fillStyle).toBe("black");
    for(const [a,b,result] of [
        [{x:0,y:0,size:25},{x:30,y:40,size:25},true],
        [{x:0,y:0,size:25},{x:30,y:40.001,size:25},false],
        [{x:0,y:0,size:10},{x:0,y:21,size:10},false],
        [{x:0,y:0,size:10},{x:40,y:0,size:30},true]
    ] as const)expect(current.read("circlesTouch("+JSON.stringify(a)+","+JSON.stringify(b)+")")).toBe(result);
});
it("keeps every rectangle visible at random endpoints and counts inclusive edges/corners/containment",()=>{
    const oldSource=fixture.projects.find((p:{project:string})=>p.project==="rectangle-collision").originals[1].source.javascript;
    const old=program(oldSource,0.999999);
    expect(old.read("rect1.x+rect1.width")).toBeGreaterThan(old.canvas.width);
    expect(old.read("checkCollision({x:50,y:50,width:100,height:100},{x:150,y:75,width:100,height:100})")).toBe(false);
    for(const random of [0,0.25,0.5,0.999999]){
        const current=program(fixture.files["rectangle-collision"].reference["script.js"],random);
        expect(current.read("[rect1,rect2].every(r=>r.x>=50&&r.y>=50&&r.x+r.width<=500&&r.y+r.height<=450)")).toBe(true);
        for(const [x,y,width,height,result] of [[150,75,100,100,true],[151,75,100,100,false],[75,150,100,100,true],[75,151,100,100,false],[150,150,100,100,true],[75,75,20,20,true],[50,300,100,100,false]]){
            expect(current.read("rectanglesTouch({x:50,y:50,width:100,height:100},"+JSON.stringify({x,y,width,height})+")")).toBe(result);
        }
    }
});
it("reproduces the original unstable stop and verifies floor rest survives1000ticks",()=>{
    const original=fixture.projects.find((p:{project:string})=>p.project==="bouncy-ball").originals[1].source.javascript;
    const old=program(original);
    old.read("x=100;y=305;dx=0;dy=0");old.tick();
    expect(old.read("dy")).toBe(0.08);
    const current=program(fixture.files["bouncy-ball"].reference["script.js"]);
    current.read("ball.x=100;ball.y=305;ball.dx=0;ball.dy=0");current.tick();
    expect(current.read("ball.resting")).toBe(true);
    const checkpoint=current.read("JSON.stringify(ball)");
    for(let i=0;i<1000;i++)current.tick();
    expect(current.read("JSON.stringify(ball)")).toBe(checkpoint);
});
it("clamps all radius-aware walls,damps each wall,and naturally settles without out-of-bounds motion",()=>{
    const current=program(fixture.files["bouncy-ball"].reference["script.js"]);
    current.tick();expect(current.read("ball.x")).toBe(242);expect(current.read("ball.y")).toBeCloseTo(285.08);
    for(const [state,axis,position,velocity] of [
        [{x:464,y:100,dx:2,dy:0},"x",465,-1.6],
        [{x:16,y:100,dx:-2,dy:0},"x",15,1.6],
        [{x:100,y:15.1,dx:0,dy:-2},"y",15,1.536],
        [{x:100,y:304.9,dx:2,dy:2},"y",305,-1.664],
        [{x:100,y:100,dx:1000,dy:1000},"x",465,-800]
    ] as const){
        current.read("Object.assign(ball,"+JSON.stringify({...state,grounded:false,resting:false})+")");current.tick();
        expect(current.read("ball."+axis)).toBeCloseTo(position);
        expect(current.read("ball."+ (axis==="x"?"dx":"dy"))).toBeCloseTo(axis==="x"&&state.dy===1000?velocity*0.8:velocity);
    }
    const natural=program(fixture.files["bouncy-ball"].reference["script.js"]);
    for(let i=0;i<30000&&!natural.read("ball.resting");i++){
        natural.tick();
        expect(natural.read("ball.x>=15&&ball.x<=465&&ball.y>=15&&ball.y<=305")).toBe(true);
    }
    expect(natural.read("ball.resting")).toBe(true);
});
