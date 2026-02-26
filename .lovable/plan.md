

# Comprehensive Audit: Wine/Delicato Presentation

## Critical Issues (Navigation Stuck / Broken Behavior)

### 1. P11 and P12 Both Render ElephantQuestionScreen (Duplicate Component)
Both slide P11 ("Answer the Question Together") and P12 ("AI Elephant Question Demo") import and render the exact same `ElephantQuestionScreen` component. This means the audience sees the identical slide twice with identical state. The notes suggest P11 should be a collaborative human-answer exercise and P12 should be the AI comparison, but they share the same component instance and database state (same `story_game_state`, `story_words`, `story_volunteers` tables). This will confuse both presenter and audience.

**Fix:** Either differentiate P11/P12 into two separate components (one for human answering, one for AI comparison), or remove P11 and have P12 be the sole elephant question slide with its internal stages handling the flow.

### 2. ElephantQuestionScreen Keyboard Handler Does NOT Use `capture: true`
The ElephantQuestionScreen registers its keyboard handler with `addEventListener("keydown", handleKeyDown)` (no capture). Every other interactive screen uses `{ capture: true }`. This means `PresentationLayout`'s handler (also no capture, registered on `window`) will race with it. In practice, pressing Space/ArrowRight on this slide may advance the slide AND trigger internal state changes simultaneously, or may navigate away before the internal stages complete.

**Fix:** Add `{ capture: true }` to the ElephantQuestionScreen's keyboard listener and ensure it `stopImmediatePropagation()` (not just `stopPropagation()`) to match the pattern used by all other interactive screens.

### 3. ElephantQuestionScreen: Answering Stage With Volunteers But No Words = Stuck
When in the "answering" stage, the keyboard handler only advances to AI comparison if `words.length > 0`. If the presenter starts answering but no words have been typed yet, pressing Space/ArrowRight does nothing -- neither advancing internally nor moving to the next slide. The presenter is stuck.

**Fix:** Allow advancing to the next slide when in "answering" stage with 0 words, or allow keyboard advance to "ai-compare" even with 0 words.

### 4. ElephantQuestionScreen: AI-Compare Stage = Navigation Stuck
In the "ai-compare" stage, the keyboard handler has no case for it. Space/ArrowRight will fall through to PresentationLayout's handler, but since ElephantQuestionScreen's handler runs first (same priority, no capture), and it calls `e.preventDefault()` / `e.stopPropagation()` in earlier conditions... actually since it uses `stopPropagation` (not `stopImmediatePropagation`), the PresentationLayout handler on the same target may or may not fire. This is unreliable. The "ai-compare" stage should explicitly allow fallthrough to slide navigation.

**Fix:** In the keyboard handler, when `stage === "ai-compare"`, do nothing (don't prevent default), letting PresentationLayout handle navigation to the next slide.

### 5. WhatChangedScreen Keyboard Handler Does NOT Use `capture: true`
Similar to ElephantQuestionScreen, this handler uses plain `addEventListener("keydown", ...)` without capture. This creates a race condition with PresentationLayout's handler. When `showBigQuestion` is true and all placements are done, pressing Space/ArrowRight should advance to the next slide, but the screen's handler runs alongside PresentationLayout's, potentially causing double-navigation or no navigation.

**Fix:** Add `{ capture: true }` to the keyboard listener.

### 6. GongLabsStudyScreen: Navigation Stuck When No Matches Made
The Gong Labs drag-and-drop matching game (P24b) requires `matches.length === 3` before Space/ArrowRight will advance internally. But there's no keyboard shortcut to auto-fill matches (unlike P9 WhatChangedScreen which auto-fills on first press). If the presenter is using keyboard-only navigation and hasn't dragged all 3 matches, they are stuck -- Space/ArrowRight does nothing, and PresentationLayout's handler is blocked by `stopImmediatePropagation`.

**Fix:** Add an auto-fill shortcut (like P9) that auto-matches all stats on first press when no matches exist, or allow fallthrough to slide navigation when the game is incomplete.

### 7. RandomComparisonScreen (P14) Scatterplot X-Axis Scales to 50, Not 100
The `MiniScatterplot` component calculates `x = (parseInt(num) / 50) * 100`. Since numbers range 1-100, any number above 50 will render off-screen (x > 100%). This is a clear bug -- numbers like 73 would render at 146% left position.

**Fix:** Change divisor from 50 to 100: `const x = (parseInt(num) / 100) * 100`.

---

## Moderate Issues (Confusing UX / Incorrect Behavior)

### 8. AudienceRandomNumberScreen: Upsert Uses Raw Supabase Instead of PollContext
P13a calls `supabase.from("responses").upsert(...)` directly instead of using `PollContext.submitResponse()`. This bypasses the context's response tracking, meaning `myResponse` in PollContext may not update properly. The submitted state indicator may not show correctly for participants.

**Fix:** Use `submitResponse({ number: num })` from PollContext instead of direct Supabase calls.

### 9. PollContext: `currentPoll` is Shared Across All Slides
There's only one `currentPoll` in the PollContext. When the presenter navigates between poll-enabled slides (P8, P13a, P17, P25), each slide calls `getPollForSlide()` or `createPoll()`, overwriting `currentPoll`. If navigation is fast, the previous slide's poll subscription gets torn down and the new one starts. This works but means going back to a previous poll-slide might briefly show stale data until the subscription catches up.

### 10. P25 (SalesQuizScreen): Participant Can't See the Game
The SalesQuizScreen has a rich interactive J-curve game, but there's no participant-specific view. Participants see the same full presenter view including game controls. There's no `isParticipant` check to show a simplified participant experience.

### 11. Solo Mode: P11/P12 ElephantQuestionScreen Shows "Waiting for volunteers" Confusion
In solo mode, the volunteering stage shows "Ask for 3 volunteers, then start!" which doesn't make sense when practicing alone. The Solo Mode button exists but the UI is cluttered.

### 12. Title Always Says "The Artistic AI Mindset" in PresentationLayout
`PresentationLayout` receives `title="The Artistic AI Mindset"` hardcoded in Index.tsx (line 587), but the `PresentationModeContext` provides `presentationTitle` which is "The Agile AI Mindset" for educator mode. The header already uses `presentationTitle` from context (line 50), so the prop is redundant but not harmful. However, the prop itself is wrong for educator mode.

---

## Minor Issues

### 13. Scatterplot Tick Marks Show 1, 25, 50 Instead of 1, 50, 100
The MiniScatterplot in RandomComparisonScreen shows tick marks at 1, 25, 50 -- but since the data range is 1-100 (and the axis is scaled to 50 as noted in issue #7), these are doubly wrong.

### 14. `removeEventListener` Uses `as any` Cast for Capture Option
Multiple screens use `window.removeEventListener("keydown", handler, { capture: true } as any)`. While this works, the `as any` cast is a TypeScript workaround that could mask issues.

### 15. P13a Auto-Creates Poll Without Checking `isSoloMode` Participant Case
The useEffect in AudienceRandomNumberScreen auto-creates/opens polls when `isPresenter || isSoloMode`. In solo mode, this works. But there's no guard against re-creating if the user navigates away and back.

---

## Summary of Fixes Needed

| Priority | Issue | Slide(s) | Fix |
|----------|-------|----------|-----|
| Critical | Duplicate ElephantQuestionScreen on P11 and P12 | P11, P12 | Remove P11 or create separate component |
| Critical | ElephantQuestionScreen keyboard handler missing `capture: true` | P11, P12 | Add `{ capture: true }` and use `stopImmediatePropagation` |
| Critical | ElephantQuestionScreen stuck in "answering" with 0 words | P11, P12 | Allow advance or fallthrough |
| Critical | ElephantQuestionScreen stuck in "ai-compare" stage | P11, P12 | Let keyboard events fall through to PresentationLayout |
| Critical | GongLabsStudyScreen stuck with 0 matches | P24b | Add auto-fill shortcut or allow advance |
| Critical | RandomComparison scatterplot X-axis scaled to 50 not 100 | P14 | Fix divisor |
| High | WhatChangedScreen keyboard handler missing `capture: true` | P9 | Add `{ capture: true }` |
| Medium | AudienceRandomNumber bypasses PollContext | P13a | Use `submitResponse()` |
| Low | Title prop hardcoded in Index.tsx | All | Use `presentationTitle` from context or remove prop |

## Technical Implementation Plan

1. **Remove P11** from the screens array in Index.tsx (it's a duplicate of P12 with identical component and overlapping DB state)
2. **Fix ElephantQuestionScreen keyboard handler**: add `{ capture: true }`, use `stopImmediatePropagation`, handle all stages properly including fallthrough at "ai-compare"
3. **Fix WhatChangedScreen keyboard handler**: add `{ capture: true }`
4. **Fix GongLabsStudyScreen**: add auto-fill on first Space/ArrowRight press when 0 matches, matching the pattern from WhatChangedScreen
5. **Fix RandomComparisonScreen**: change scatterplot divisor from 50 to 100, update tick marks to show 1, 50, 100
6. **Fix AudienceRandomNumberScreen**: use PollContext `submitResponse` instead of direct Supabase call
7. **Clean up**: remove hardcoded title prop from Index.tsx

