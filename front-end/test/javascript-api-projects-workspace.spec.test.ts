import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { gunzipSync } from "node:zlib";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey,javascriptCourseResource } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import { clearLocalPythonProjects,createPythonIdeProject,loadLocalPythonProjectsAsync,loadPythonIdeStarterFilesFromGitHub,saveLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
const fixture=JSON.parse(readFileSync(resolve("../test/fixtures/javascript-api-projects-sources.json"),"utf8"));
const sha=(value:string)=>createHash("sha256").update(value).digest("hex");
afterEach(async()=>{vi.unstubAllGlobals();await clearLocalPythonProjects();});
for(const resource of fixture.resources){
    it("imports,saves,reopens and exports all supplied "+resource.project+"/"+resource.role+" files",async()=>{
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
        expect(requests).toHaveLength(resource.files.length);
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
        expect(Object.keys(archive)).toHaveLength(resource.files.length);
        for(const file of saved.files){
            const name=Object.keys(archive).find(n=>n.endsWith("/"+file.name))!;
            expect(strFromU8(archive[name])).toBe(file.content);
        }
    });
}
for(const role of ["learner","instructor"]){
    it("retains all four identities and optional placement,complete guidance and correct source roles for "+role,async()=>{
        setActivePinia(createPinia());
        if(role==="instructor")useAppStore().setCurrentTutor({_id:"api-tutor",name:"Tutor",email:"tutor@example.invalid",age:30,state:"GA",usersOfTutorLength:0,coursePermissions:[fixture.courseId],editTutors:false,saveEdit:"Save"});
        const course=(await useCoursesStore().loadCourseById(fixture.courseId))!;
        const module=course.modules.find(m=>m.id===fixture.moduleId)!;
        const reading=module.curriculum.find(i=>i.id===fixture.reading.id)!;
        expect(reading.contentKind).toBe("reading");expect(reading.content).toBe(fixture.reading.content.trim());
        for(const project of fixture.projects){
            const item=[...module.curriculum,...module.supplementalProjects].find(i=>i.id===project.itemId)!;
            expect(item.title).toBe(project.catalogTitle);
            expect(item.learningPath).toBe(project.learningPath);
            expect(item.content).toContain("CASES.md");
            expect(item.content).toContain("Open index.html");
            expect(javascriptCourseResource(item.projectLink!)?.project).toBe(project.project);
            const reference=fixture.resources.find((r:{project:string;role:string})=>r.project===project.project&&r.role==="reference");
            expect(item.solutionLink).toBe(role==="instructor"?reference.urls[0]:undefined);
        }
    });
}
const originalData=JSON.parse(gunzipSync(readFileSync(resolve("../test/fixtures/javascript-api-projects-original-data.json.gz"))).toString());
function rows(name:string){const [heading,...lines]=originalData.sourceFiles[name].trim().split("\n");const keys=heading.split(",");return lines.map((line:string)=>Object.fromEntries(line.split(",").map((value:string,index:number)=>[keys[index],value])));}
function dataScope(name:string){const scope=createContext();for(const [file,source] of Object.entries(fixture.files[name].reference) as [string,string][]){if(file==="fixtures.js")runInContext(source,scope);}if(name==="pokedex")for(let i=1;i<=4;i++)runInContext(fixture.files[name].reference["pokemon-"+i+".js"],scope);return (expression:string)=>runInContext(expression,scope);}
it("retains all893 original names,types,six stats and independently hashed actual sprites",()=>{
 const read=dataScope("pokedex");const records=JSON.parse(read("JSON.stringify(pokemonFixtures)"));expect(records).toHaveLength(893);
 const names=new Map(rows("pokemon.csv").map((r:any)=>[Number(r.id),r.identifier]));
 const statNames=new Map(rows("stats.csv").map((r:any)=>[Number(r.id),r.identifier]));
 const typeNames=new Map(rows("types.csv").map((r:any)=>[Number(r.id),r.identifier]));
 const rawStats=rows("pokemon_stats.csv"),rawTypes=rows("pokemon_types.csv");
 for(const [index,record] of records.entries()){
  expect(record.id).toBe(index+1);expect(record.name).toBe(names.get(record.id));
  expect(record.stats).toEqual(rawStats.filter((r:any)=>Number(r.pokemon_id)===record.id).map((r:any)=>({base_stat:Number(r.base_stat),stat:{name:statNames.get(Number(r.stat_id))}})));
  expect(record.types).toEqual(rawTypes.filter((r:any)=>Number(r.pokemon_id)===record.id).map((r:any)=>({slot:Number(r.slot),type:{name:typeNames.get(Number(r.type_id))}})).sort((a:any,b:any)=>a.slot-b.slot));
  const bytes=Buffer.from(record.sprites.front_default.split(",")[1],"base64");expect(sha(bytes as any)).toBe(originalData.sprites.find((r:any)=>r.id===record.id).sha256);
 }
 expect(new Set(records.map((r:any)=>r.name)).size).toBe(893);
});
it("retains actual permitted fox photos and complete project file/byte bounds",()=>{
 const read=dataScope("fox-generator");const photos=JSON.parse(read("JSON.stringify(foxFixtures)"));expect(photos).toHaveLength(3);
 for(const [index,photo] of photos.entries()){expect(sha(Buffer.from(photo.image.split(",")[1],"base64") as any)).toBe(originalData.photoSources[index].sha256);expect(photo.credit).toBe(originalData.photoSources[index].credit);expect(originalData.photoSources[index].license).toBe("Public Domain");}
 for(const resource of fixture.resources){expect(resource.files.length).toBeLessThanOrEqual(80);expect(resource.files.reduce((sum:number,f:any)=>sum+f.byteLength,0)).toBeLessThanOrEqual(4000000);expect(resource.files.every((f:any)=>f.byteLength<=1000000)).toBe(true);}
});
function runtime(name:string,fetcher=(async()=>new Response("{}",{headers:{"Content-Type":"application/json"}})) as typeof fetch){
 document.body.innerHTML=fixture.files[name].reference["index.html"].replace(/<script[\s\S]*?<\/script>/g,"");
 class SavedImage{constructor(){const image=document.createElement("img");image.decode=()=>Promise.resolve();let value="";Object.defineProperty(image,"src",{get:()=>value,set:(next:string)=>{value=next;queueMicrotask(()=>next?image.onload?.(new Event("load")):image.onerror?.(new Event("error")));}});return image;}}
 const scope=createContext({document,Image:SavedImage,Response,Headers,URL,TextDecoder,Uint8Array,AbortController,structuredClone,fetch:fetcher,setTimeout,clearTimeout,queueMicrotask,console});
 runInContext(fixture.files[name].reference["fixtures.js"],scope);if(name==="pokedex")for(let i=1;i<=4;i++)runInContext(fixture.files[name].reference["pokemon-"+i+".js"],scope);
 runInContext(fixture.files[name].reference["request.js"],scope);runInContext(fixture.files[name].reference["script.js"],scope);
 return {read:(expression:string)=>runInContext(expression,scope)};
}
it("keeps invalid and repeated Funny Meter ratings attached to the current joke",async()=>{
 const p=runtime("funny-meter");await vi.waitFor(()=>expect(p.read("session?.jokes.length")).toBe(10));
 expect(p.read("recordRating(session,'other','joke-0')")).toBe(false);expect(p.read("session.ratings.length")).toBe(0);
 expect(p.read("recordRating(session,'yes','joke-0')")).toBe(true);expect(p.read("recordRating(session,'no','joke-0')")).toBe(false);expect(p.read("session.ratings.length")).toBe(1);
 p.read("for(let i=1;i<10;i++)recordRating(session,i<5?'yes':'no','joke-'+i);renderSession()");expect(document.querySelector("#result")?.textContent).toBe("An even split.");expect(p.read("recordRating(session,'yes','joke-9')")).toBe(false);
});
it("rejects malformed Pokemon identities,stats,types and sprite origins before display",async()=>{
 const p=runtime("pokedex");await vi.waitFor(()=>expect(document.querySelector("#output h2")?.textContent).toBe("bulbasaur"));
 expect(()=>p.read("normalizePokemon({...pokemonFixtures[0],id:894})")).toThrow(/893-entry/);
 expect(()=>p.read("normalizePokemon({...pokemonFixtures[0],stats:Array(6).fill(pokemonFixtures[0].stats[0])})")).toThrow(/stats/);
 expect(()=>p.read("normalizePokemon({...pokemonFixtures[0],types:[{type:{name:'<img src=x>'}}]})")).toThrow(/types/);
 expect(()=>p.read("normalizePokemon({...pokemonFixtures[0],sprites:{front_default:'https://example.invalid/1.png'}},true)")).toThrow(/image URL/);
 expect(document.querySelectorAll("#pokemon-names option")).toHaveLength(893);
});
it("bounds actual streamed JSON and cancels oversized and malformed responses",async()=>{
 const p=runtime("programming-jokes");await vi.waitFor(()=>expect(document.querySelector("#setup")?.textContent).toBeTruthy());
 const scope=(p as any);const valid=await scope.read("readJson(new Response('{\"ok\":true}',{headers:{'Content-Type':'application/json'}}))");expect(valid.ok).toBe(true);
 await expect(scope.read("readJson(new Response('x'.repeat(MAX_RESPONSE_BYTES+1),{headers:{'Content-Type':'application/json'}}))")).rejects.toThrow(/too large/);
 await expect(scope.read("readJson(new Response('',{headers:{'Content-Type':'application/json'}}))")).rejects.toThrow(/Empty/);
 await expect(scope.read("readJson(new Response('{',{headers:{'Content-Type':'application/json'}}))")).rejects.toThrow(/invalid JSON/);
 await expect(scope.read("readJson(new Response('{}',{status:503,headers:{'Content-Type':'application/json'}}))")).rejects.toThrow(/HTTP 503/);
 expect(()=>p.read("normalizeJoke({setup:'missing answer'})")).toThrow(/text/);
});
it("caches only validated live responses and prevents concurrent or late canceled updates",async()=>{
 let calls=0,release:((response:Response)=>void)|undefined;
 const fetcher=vi.fn(async()=>{calls++;return new Promise<Response>(resolve=>{release=resolve;});});const p=runtime("programming-jokes",fetcher as any);
 await vi.waitFor(()=>expect(p.read("current?.setup")).toBeTruthy());
 const pending=p.read("requestJson('https://example.invalid/one',normalizeJoke)");await expect(p.read("requestJson('https://example.invalid/two',normalizeJoke)")).rejects.toThrow(/already pending/);
 p.read("activeRequest.abort()");await expect(pending).rejects.toThrow(/canceled/);release!(new Response('{"setup":"late","punchline":"late"}',{headers:{"Content-Type":"application/json"}}));await Promise.resolve();expect(p.read("cache.size")).toBe(0);expect(calls).toBe(1);
});
