/*
  HOW TO ADD A VIDEO
  -------------------
  Copy one of the objects below, paste it into the VIDEOS array,
  and edit the fields. Save the file and refresh the page.

  type: "youtube" -> src is the YouTube video ID (the part after v= in the URL)

  type: "medal"   -> src is a Medal.tv EMBED link, not the regular
                      clip link you get from "Copy Link". To turn a normal
                      Medal link into an embed link, change "clips" to
                      singular "clip" in the URL and drop anything after
                      the clip ID (like ?invite=...).
                        Regular: https://medal.tv/games/roblox/clips/AbC123?invite=xyz
                        Embed:   https://medal.tv/games/roblox/clip/AbC123

  type: "file"    -> src is a path to a video file you've uploaded next to
                      this site, e.g. "videos/inventory-demo.mp4"

  Leave "tags" as a short list of systems shown in the video.
  Delete the two placeholder objects once you have real projects to show.
*/

const VIDEOS = [
  {
    title: "Quest System",
    description: "A quest and dialogue system where a farmer NPC offers the player a job player has to collect his apples and get paid for it. Quest progress and the reward are saved through DataStores, so nothing resets between sessions",
    tags: ["Quest", "NPCs","Datastores"],
    type: "medal",
    src: "https://medal.tv/games/roblox-studio/clips/nwkbH4cYoplSIU1YU"
  },
  {
    title: "Add another project",
    description: "Keep going here. Two or three strong demos with a short breakdown of what each system does will say more than a long list.",
    tags: ["Placeholder"],
    type: "placeholder",
    src: ""
  }

  /* Examples of filled-in entries:

  {
    title: "Inventory and Currency System",
    description: "Client-server inventory with stacking, a drag and drop UI, and a currency system backed by DataStores with retry and session locking.",
    tags: ["DataStores", "UI", "Economy"],
    type: "youtube",
    src: "dQw4w9WgXcQ"
  },

  {
    title: "Vehicle Handling Demo",
    description: "Custom vehicle physics with a garage and dealership system.",
    tags: ["Vehicles", "UI"],
    type: "medal",
    src: "https://medal.tv/games/roblox/clip/AbC123XyZ"
  },

  */
];
