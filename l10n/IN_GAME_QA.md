# In-game wording review

Use this list when a translated line needs the rendered scene to decide its wording. Keep the key and the route to the scene so the review can be repeated. Mark an item done only after checking the text in game.

| Status | Room and key | Route | Check in game |
| --- | --- | --- | --- |
| Open | Room 26: `room.26.chat.104.choice.0`, `room.26.chat.105.choice.0` | The `bussyeat` callback opens chat 104. The `bussycry` callback leads through `bussycry2` to chat 105. | See the image and choice button together. Decide whether each BG label should read as an instruction, a sound, or a description of Alex's reaction. The current wording clarifies where Alex's face is, but may still feel unnatural. Check the ES labels at the same time. |
| Open | Room 26: `room.26.chat.106.text` | `confess_bigguy` opens chat 106 with `speaker: "me"`; its choice leads to chat 107. | Check whether the bracketed first-person confession works with Alex's portrait and the following response. Choose direct dialogue or a narrated action if it reads better on screen. |

The manual translation queue for the new `.3` scenes is tracked separately in `pending-manual.json` and appears in the translation checker report.
