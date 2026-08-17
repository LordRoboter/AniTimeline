import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

const ANILIST_URL = 'https://graphql.anilist.co'

export async function anilist<TData, TVariables>(
	document: TypedDocumentNode<TData, TVariables>,
	variables?: TVariables
): Promise<TData> {
	const query = print(document)

	const response = await fetch(ANILIST_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			query,
			variables
		})
	})

	if (!response.ok) {
		throw new Error(`AniList request failed: ${response.status}`)
	}

	const result = await response.json()

	if (result.errors) {
		throw new Error(
			result.errors.map((error: { message: string }) => error.message).join('\n')
		)
	}

	return result.data
}