/*
  HOW TO ADD A VIDEO
  -------------------
  Copy one of the objects below, paste it into the VIDEOS array,
  and edit the fields. Save the file and refresh the page.

  type: "youtube"  -> src is the YouTube video ID (the part after v= in the URL)
  type: "file"     -> src is a path to a video file, e.g. "videos/inventory-demo.mp4"

  Leave "tags" as a short list of systems shown in the video.
  Delete the two placeholder objects once you have real projects to show.
*/

const VIDEOS = [
  {
    title: "Add your first project",
    description: "Replace this placeholder with a real demo. Duplicate this object in videos-data.js, set type to \"youtube\" or \"file\", and fill in the fields.",
    tags: ["Placeholder"],
    type: "placeholder",
    src: ""
  },
  {
    title: "Add another project",
    description: "Keep going here. Two or three strong demos with a short breakdown of what each system does will say more than a long list.",
    tags: ["Placeholder"],
    type: "placeholder",
    src: ""
  }

  /* Example of a filled-in entry:
  {
    title: "Inventory and Currency System",
    description: "Client-server inventory with stacking, a drag and drop UI, and a currency system backed by DataStores with retry and session locking.",
    tags: ["DataStores", "UI", "Economy"],
    type: "youtube",
    src: "dQw4w9WgXcQ"
  },
  */
];
