import OSS from "ali-oss";

export const client = new OSS({
  region: "oss-cn-chengdu",
  accessKeyId: import.meta.env.VITE_ALIOSS_ACCESS_KEY_ID,
  accessKeySecret: import.meta.env.VITE_ALIOSS_ACCESS_KEY_SECRET,
  bucket: "guangxigaosugonglu",
});
