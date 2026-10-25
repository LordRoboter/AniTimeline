import type { MediaListStatus } from "../../../graphql/generated";

export type MediaListType = {
 status: MediaListStatus | null;
 media: {
 id: number;
 bannerImage: string | null;
 title: {
 romaji: string | null;
 } | null;
 coverImage: {
 medium: string | null;
 extraLarge: string | null;
 } | null;
 } | null;
 completedAt: {
 day: number | null;
 month: number | null;
 year: number | null;
 } | null;
 startedAt: {
 day: number | null;
 month: number | null;
 year: number | null;
 } | null;
};