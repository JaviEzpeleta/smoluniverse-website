import axios from "axios"
import * as cheerio from "cheerio"

const CHAR_LIMIT = 16

export const getFaviconUrl = (domain: string) => {
  const cleanDomainName = domain.replace("https://", "")
  const cleanDomainName2 = cleanDomainName.replace("www.", "")
  // i just want the domain name, nothing about the path
  const cleanDomainName3 = cleanDomainName2.split("/")[0]
  return `https://icons.duckduckgo.com/ip3/${cleanDomainName3}.ico`
}

export const cleanURL = (url: string) => {
  // remove the https://
  const clean = url.replace("https://", "")
  // remove the www.
  const clean2 = clean.replace("www.", "")
  // remove the trailing slash
  const clean3 = clean2.replace(/\/$/, "")

  // if clean3 is longer than 20 characters, truncate it
  if (clean3.length > CHAR_LIMIT) {
    return clean3.substring(0, CHAR_LIMIT) + "..."
  }
  return clean3
}

export type WebsiteMetaTags = {
  title: string | null
  thumbnail: string | null
}

type MetaTags = {
  title: string | null
  thumbnail: string | null
}

export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url)
    return response.status === 200
  } catch {
    return false
  }
}

export const fetchMetaTags = async (url: string): Promise<MetaTags> => {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "MetaTagFetcher/1.0" },
    })
    const $ = cheerio.load(response.data)
    const title = $("title").text() || null

    let thumbnail =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='twitter:image']").attr("content") ||
      null

    // Verify if thumbnail exists
    if (thumbnail && !(await checkImageExists(thumbnail))) {
      thumbnail = null
    }

    return { title, thumbnail }
  } catch (error) {
    // console.error(`Error fetching or parsing URL:`, error)
    return { title: null, thumbnail: null }
  }
}
