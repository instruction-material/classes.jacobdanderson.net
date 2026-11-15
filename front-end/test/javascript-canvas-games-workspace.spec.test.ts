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
const fixture=JSON.parse(readFileSync(resolve("../test/fixtures/javascript-canvas-games-sources.json"),"utf8"));
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
    it("retains all four core identities,complete guidance and correct source roles for "+role,async()=>{
        setActivePinia(createPinia());
        if(role==="instructor")useAppStore().setCurrentTutor({_id:"canvas-tutor",name:"Tutor",email:"tutor@example.invalid",age:30,state:"GA",usersOfTutorLength:0,coursePermissions:[fixture.courseId],editTutors:false,saveEdit:"Save"});
        const course=(await useCoursesStore().loadCourseById(fixture.courseId))!;
        const module=course.modules.find(m=>m.id===fixture.moduleId)!;
        for(const project of fixture.projects){
            const item=module.curriculum.find(i=>i.id===project.itemId)!;
            expect(item.title).toBe(project.catalogTitle);
            expect(item.learningPath).toBe("core");
            expect(item.content).toContain("CASES.md");
            expect(item.content).toContain("Open index.html");
            expect(javascriptCourseResource(item.projectLink!)?.project).toBe(project.project);
            const reference=fixture.resources.find((r:{project:string;role:string})=>r.project===project.project&&r.role==="reference");
            expect(item.solutionLink).toBe(role==="instructor"?reference.urls[0]:undefined);
        }
    });
}
function program(source:string){
 const events:Record<string,(event:any)=>void>={};let scheduled=0;
 const ctx=new Proxy({} as Record<string,any>,{get:(object,key:string)=>object[key]??(()=>{}),set:(object,key:string,value)=>{object[key]=value;return true;}});
 const canvas={width:550,height:500,getContext:()=>ctx,addEventListener:(name:string,callback:any)=>{events[name]=callback;},focus(){}};
 const status={textContent:""};
 const button={addEventListener(){}};
 const raf=()=>{scheduled++;};
 const document={getElementById:()=>canvas,querySelector:(selector:string)=>selector==="canvas"?canvas:selector.includes("status")?status:selector==="main"?{clientWidth:550}:button,querySelectorAll:()=>[],addEventListener(){}};
 const window={requestAnimationFrame:raf,addEventListener:(name:string,callback:any)=>{events[name]=callback;}};
 const scope=createContext({document,window,requestAnimationFrame:raf,setInterval:()=>1,alert:()=>{},innerHeight:900,console});
 runInContext(source,scope);
 return {events,canvas,status,scheduled:()=>scheduled,read:(expression:string)=>runInContext(expression,scope)};
}
const current=(name:string)=>program(fixture.files[name].reference["script.js"]);
const original=(name:string)=>program(fixture.projects.find((p:any)=>p.project===name).originals.find((p:any)=>p.role==="reference").source.javascript);
it("checks every falling circle, inclusive geometry, true countdown, bounded movement and stable loss",()=>{
 const old=original("falling-skies");old.read("circles=[{x:0,y:0},{x:275,y:430}]");expect(old.read("playerHit()")).toBe(false);
 const p=current("falling-skies");p.read("game.countdown=0;game.circles=[{x:0,y:0,radius:15},{x:275,y:430,radius:15}];stepGame(game,{},()=>0.5)");expect(p.read("game.status")).toBe("lost");
 const stopped=p.read("JSON.stringify(game)");p.read("for(let i=0;i<300;i++)stepGame(game,{right:true})");expect(p.read("JSON.stringify(game)")).toBe(stopped);
 expect(p.read("circleTouchesRectangle({x:245,y:400,radius:15},{x:260,y:400,width:30,height:60})")).toBe(true);
 expect(p.read("circleTouchesRectangle({x:246,y:386,radius:15},{x:260,y:400,width:30,height:60})")).toBe(false);
 p.read("game=newGame();for(let i=0;i<180;i++)stepGame(game,{left:true},()=>0)");expect(p.read("game.countdown")).toBe(0);expect(p.read("game.circles.length")).toBe(0);expect(p.read("game.x")).toBe(0);
 p.read("for(let i=0;i<120;i++)stepGame(game,{right:true},()=>0)");expect(p.read("game.x")).toBe(520);expect(p.read("game.score")).toBe(1);
 p.read("game.circles=[{x:0,y:600,radius:15},{x:0,y:601,radius:15}];stepGame(game,{},()=>0)");expect(p.read("game.circles.length")).toBe(0);
});
it("spends one Breakout life per miss and freezes won/lost states without recurring alerts",()=>{
 const old=original("breakout");old.read("lives=1;x=400;y=310;dx=0;dy=2;paddleX=0;draw();draw()");expect(old.read("lives")).toBe(-1);
 const p=current("breakout");expect(p.read("circleTouchesRectangle({x:20,y:40,radius:10},{x:30,y:30,width:75,height:20})")).toBe(true);expect(p.read("circleTouchesRectangle({x:19,y:19,radius:10},{x:30,y:30,width:75,height:20})")).toBe(false);
 p.read("for(let i=0;i<3;i++){Object.assign(game,{x:20,y:332,dx:0,dy:3,paddleX:400});stepGame(game,{})}");expect(p.read("game.lives")).toBe(0);expect(p.read("game.status")).toBe("lost");
 const stopped=p.read("JSON.stringify(game)");p.read("for(let i=0;i<300;i++)stepGame(game,{left:true})");expect(p.read("JSON.stringify(game)")).toBe(stopped);
 p.read("game=newGame();game.bricks.forEach(b=>b.alive=false);game.bricks[0].alive=true;game.score=14;Object.assign(game,{x:40,y:61,dx:0,dy:-2});stepGame(game,{})");expect(p.read("game.status")).toBe("won");expect(p.read("game.score")).toBe(15);
 const won=p.read("JSON.stringify(game)");p.read("for(let i=0;i<300;i++)stepGame(game,{right:true})");expect(p.read("JSON.stringify(game)")).toBe(won);
});
it("shares Asteroids cooldown between both keys, splits once and freezes every system after death",()=>{
 const old=original("asteroids");const before=old.scheduled();old.read("cooldownTimer=5;keyDownHandler({key:'f'})");expect(old.scheduled()).toBe(before+1);
 const p=current("asteroids");p.read("game.cooldown=5;stepGame(game,{fire:true})");expect(p.read("game.bullets.length")).toBe(0);
 p.read("game=newGame();for(let i=0;i<10;i++)stepGame(game,{fire:true})");expect(p.read("game.bullets.length")).toBe(1);p.read("stepGame(game,{fire:true})");expect(p.read("game.bullets.length")).toBe(2);
 p.read("game=newGame();game.circles=[{x:300,y:100,radius:50,heading:0}];game.bullets=[{x:300,y:100,radius:10,heading:0}];stepGame(game,{},()=>0.5)");expect(p.read("game.score")).toBe(1);expect(p.read("JSON.stringify(game.circles.map(c=>c.radius))")).toBe("[25,25]");expect(p.read("game.bullets.length")).toBe(0);
 expect(p.read("shipTouchesCircle({x:100,y:100,angle:0},{x:100,y:70,radius:15})")).toBe(true);expect(p.read("shipTouchesCircle({x:100,y:100,angle:0},{x:120,y:80,radius:5})")).toBe(false);
 p.read("game.circles=[{x:100,y:100,radius:50,heading:0}];stepGame(game,{})");expect(p.read("game.status")).toBe("lost");const lost=p.read("JSON.stringify(game)");p.read("for(let i=0;i<1000;i++)stepGame(game,{fire:true,up:true})");expect(p.read("JSON.stringify(game)")).toBe(lost);
});
it("keeps all stars through wrap and resize with the original colors, count and velocities",()=>{
 const p=current("starfield");expect(p.read("game.stars.length")).toBe(100);
 p.read("game.stars[0]={x:10,y:10,size:2,velocity:30};stepGame(game,{})");expect(p.read("game.stars[0].y")).toBe(11);
 p.read("game.stars[0].y=500;stepGame(game,{},()=>0.5)");expect(p.read("game.stars[0].y")).toBe(0);expect(p.read("game.stars[0].x")).toBe(275);expect(p.read("game.stars.length")).toBe(100);
 p.read("game.stars[0].y=100;resizeStars(game,275,250)");expect(p.read("game.stars[0].x")).toBe(137.5);expect(p.read("game.stars[0].y")).toBe(50);expect(p.read("game.stars.every(s=>s.x>=0&&s.x<=275&&s.y>=0&&s.y<=250&&s.velocity>=15&&s.velocity<=30)")).toBe(true);
});
it("clears every held control when focus is lost",()=>{
 for(const name of ["falling-skies","breakout","asteroids"]){const p=current(name);p.events.keydown({key:"ArrowLeft",preventDefault(){}});expect(p.read("keys.left")).toBe(true);p.events.blur({});expect(p.read("Object.values(keys).some(Boolean)")).toBe(false);}
});
