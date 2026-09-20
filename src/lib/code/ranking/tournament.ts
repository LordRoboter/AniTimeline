import { PUBLIC_USE_TEST_DATA } from '$env/static/public';
import { anilist } from '$lib/anilist/client';
import { AnimeCharactersDocument, type Character } from '../../../../graphql/generated';
import { testCharacters } from '../../mock/characters';

const useTestData = PUBLIC_USE_TEST_DATA === 'true';

export type Match = {
	players: Character[];
	winner?: Character;
};

export type TournamentState = {
	round: number;
	matches: Match[];
	champion?: Character;
};

export function createTournament(characters: Character[]): TournamentState {
	const shuffled = [...characters].sort(() => Math.random() - 0.5);

	return {
		round: 1,
		matches: createMatches(shuffled)
	};
}

function createMatches(characters: Character[]): Match[] {
	const matches: Match[] = [];

	for (let i = 0; i < characters.length; i += 2) {
		matches.push({
			players: characters.slice(i, i + 2)
		});
	}

	return matches;
}

export function chooseCharacter(
	state: TournamentState,
	matchIndex: number,
	characterId: number
): TournamentState {
	const match = state.matches[matchIndex];

	const winner = match.players.find(
		character => character.id === characterId
	);

	if (!winner) {
		return state;
	}

	const updatedMatches = state.matches.map((match, index) =>
		index === matchIndex
			? { ...match, winner }
			: match
	);

	// Still have unfinished matches in this round
	if (updatedMatches.some(match => !match.winner)) {
		return {
			...state,
			matches: updatedMatches
		};
	}

	// Everybody in this round has played.
	const winners = updatedMatches
		.map(match => match.winner)
		.filter((character): character is Character => character !== undefined);

	// We have a champion
	if (winners.length === 1) {
		return {
			round: state.round,
			matches: updatedMatches,
			champion: winners[0]
		};
	}

	// Create the next round
	return {
		round: state.round + 1,
		matches: createMatches(winners)
	};
}

export async function loadCharacters() {
	if (useTestData) {
		return testCharacters;
	}

	const data = await anilist(AnimeCharactersDocument, {
		id: 185
	});

	return (data.Media?.characters?.nodes ?? []).filter(
		(character) => character !== null
	);
}