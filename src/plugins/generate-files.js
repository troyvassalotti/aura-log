/**
 * @file Data given to vite-plugin-generate-file
 */

import { readdirSync, readFileSync } from "node:fs";
import matter from "gray-matter";
import config from "../auralog.config.js";

/** Where all the logs are stored. */
const dir = `./${config.contentDir}`;

/** Content files. */
const content = readdirSync(dir, (err, files) => {
  if (err) {
    throw err;
  }

  return files;
});

/** Content parsed for their front matter. */
const data = content.map((file) => {
  const str = readFileSync(dir + "/" + file, "utf8");
  const frontmatter = matter(str);
  const { data, content } = frontmatter;

  // If there's no date from the front matter, create it from the file name
  if (!data.date) {
    /** The date & time string from the file name. */
    const fileName = file.replace(/(\D+\/+)(\d+)(.md)/, "$2");

    const year = fileName.substring(0, 4); /* YYYY */
    const month = fileName.substring(4, 6); /* MM */
    const day = fileName.substring(6, 8); /* DD */
    const isoDate = `${year}-${month}-${day}`; /* YYYY-MM-DD */

    const hour = fileName.substring(8, 10); /* HH */
    const minutes = fileName.substring(10, 12); /* MM */
    const isoTime = `${hour}:${minutes}`; /* HH:MM */

    data.date = `${isoDate}T${isoTime}`; /* YYYY-MM-DDTHH:MM */
  }

  if (config.parseJournal) {
    return { ...data, content };
  }

  return { ...data };
});

export default data;
