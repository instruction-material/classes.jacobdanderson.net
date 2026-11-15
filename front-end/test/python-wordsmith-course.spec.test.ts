import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { addPythonIdeClassroomSectionsToSource } from "@/modules/pythonIde";
import { useCoursesStore } from "@/stores/courses";
import { pythonLevel2Course } from "@/stores/courses/python-level-2";
import { pythonLevel2ClassroomCourse } from "@/stores/courses/python-level-2-classroom";
const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/python-wordsmith-sources.json"), "utf8"));
describe("Wordsmith original project and classroom framework", () => {
    it("teaches the actual timed word game and complete input inventory", () => {
        const module = pythonLevel2Course.modules.find(m => m.title === "PS13 Wordsmith")!;
        expect(module.keyBlocks).toContain("monotonic deadline");
        expect(module.curriculum[0].content).toContain("time.monotonic()");
        expect(module.curriculum[0].content).toContain(":quit");
        expect(JSON.stringify(module)).not.toContain("grammar cleanup");
        expect(module.curriculum[0].projectLink).toContain(fixture.revision + "/PS13-Wordsmith/starter");
        expect(module.curriculum[0].solutionLink).toContain(fixture.revision + "/PS13-Wordsmith/solution");
    });
    it("keeps the complete timer reference and active Normal/Hard hooks unchanged on classroom import", () => {
        const source = fixture.files["PS13-Wordsmith/solution/main.py"].content;
        expect(addPythonIdeClassroomSectionsToSource(source)).toBe(source);
        expect(source).toContain("score += word_score(word)");
        expect(source).toContain("letters = choose_letters()");
        expect(source).not.toContain("normal_addition");
        const launch = pythonLevel2ClassroomCourse.modules[0].curriculum.find(i => i.title.includes("Wordsmith"))!;
        expect(launch.content).toContain("word_score(word)");
        expect(launch.content).toContain("round deadline");
        expect(launch.solutionLink).toContain(fixture.revision);
    });
    it("preserves both normalized assignment identities and source roles", async () => {
        setActivePinia(createPinia());
        for (const classroom of [false, true]) {
            const courseID = classroom ? "python-level-2-classroom" : "python-level-2";
            const course = await useCoursesStore().loadCourseById(courseID);
            const moduleID = classroom ? "python-level-2-classroom-classroom-launch-build-extend-explain" : "python-level-2-ps13-wordsmith";
            const module = course!.modules.find(m => m.id === moduleID)!;
            const item = module.curriculum.find(i => i.title.includes("Wordsmith"))!;
            expect(item.id).toBe(moduleID + (classroom ? "-curriculum-launch-project-7-wordsmith-challenge" : "-curriculum-ps13-project-1-wordsmith"));
            expect(item.projectLink).toBeTruthy();
        }
    });
});
