import assert from "node:assert/strict";
import { ROLE_NAME, messageLabel, mortalInfoText, roleForThread, tabName, threadIdFor } from "../src/topics.ts";

assert.equal(messageLabel("mortal", "alice_tan"), "🎯 Prankee (@alice_tan)");
assert.equal(messageLabel("angel", "alice_tan"), "😈 Pranker");
assert.ok(!messageLabel("angel", "alice_tan").includes("alice_tan")); // a pranker is never named

assert.equal(tabName("mortal", "bob_lim"), "🎯 Prankee: @bob_lim (you prank them)");
assert.equal(tabName("mortal", null), "🎯 Prankee: none assigned");
assert.equal(tabName("angel", "bob_lim"), "😈 Pranker: secret (pranking you)"); // never names anyone
for (const name of [tabName("mortal", "a".repeat(32)), tabName("angel", null)]) assert.ok(name.length <= 128); // Telegram's limit

assert.equal(ROLE_NAME.angel, "pranker");
assert.equal(ROLE_NAME.mortal, "prankee");

const p = { angel_thread_id: 11, mortal_thread_id: 22 };
assert.equal(threadIdFor(p, "angel"), 11);
assert.equal(threadIdFor(p, "mortal"), 22);
assert.equal(roleForThread(p, 11), "angel");
assert.equal(roleForThread(p, 22), "mortal");
assert.equal(roleForThread(p, 33), null); // some other topic
assert.equal(roleForThread(p, undefined), null); // General area

const noTabs = { angel_thread_id: null, mortal_thread_id: null };
assert.equal(threadIdFor(noTabs, "angel"), null);
assert.equal(roleForThread(noTabs, undefined), null);
assert.equal(roleForThread(noTabs, 11), null);

assert.equal(mortalInfoText("Level 2: Basic Pranks", "my bed"), "🌶️ Prank intensity: Level 2: Basic Pranks\n⛔ OUT OF BOUNDS: my bed");
assert.equal(mortalInfoText("Level 2: Basic Pranks", null), "🌶️ Prank intensity: Level 2: Basic Pranks");
assert.equal(mortalInfoText(null, "my bed"), "⛔ OUT OF BOUNDS: my bed");
assert.equal(mortalInfoText(null, null), "");

console.log("topics tests passed");
