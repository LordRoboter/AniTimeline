import { AnimeCharactersDocument, type Character } from '../../../../graphql/generated';
import { anilist } from '$lib/anilist/client';
import { PUBLIC_USE_TEST_DATA } from '$env/static/public';
import { testCharacters } from '$lib/mock/characters';

const useTestData = PUBLIC_USE_TEST_DATA === 'true';

type Ranking<T> = {
	items: T[];
	relations: Relation<T>[];
};


type Relation<T> =
	| OrderedRelation<T>
	| ComaprisonRelation<T>;


type OrderedRelation<T> = {
	order: OrderedItem<T>[];
}

type OrderedItem<T> =
	| OrderedCategory<T>
	| OrderedObject<T>;

interface OrderedItemType {
	certainty?: number;
	ranking?: number;
}

interface OrderedCategory<T> extends OrderedItemType{
	label?: string;
	items: T[];
}


interface OrderedObject<T> extends OrderedItemType {
	item: T;
}

type ComaprisonRelation<T> = {
	comparisons: Comparison<T>[];
}


type Comparison<T> = {
	left: T[];
	right: T[];
	//left are ... than right
	operator: Operator[];
}

type Operator = {
	operator: OperatorType;
	certainty?: number;
}

enum OperatorType {
	better,
	equal,
	worse
}

export type TournamentState<T> = {
	characters: T[];
	ranking: number[][];
	finished: boolean;
	groups: number[][];
	groupIndex: number;
};

export type RankingState<T> =
	| {
			status: 'waiting';
			choices: T[];
	  }
	| {
			status: 'finished';
			ranking: T[];
	  };


export async function load() {
    let characters = $state<Character[]>([]);
	if (useTestData) {
		characters = testCharacters;
	} else {
		const data = await anilist(AnimeCharactersDocument, {
			id: 185
		});

		characters = data.Media?.characters?.nodes ?? [];
	}
}

export function start(characters: Character[], nCharacters: number): RankingState<Character> {
    remaining = characters;
    return nextStage(characters, nCharacters);
}

export function nextStage(characters: Character[], nCharacters: number): RankingState<Character> {
    if (characters.length <= 1) {
		return {
			status: 'finished',
			ranking: characters
		};
	}

	return {
		status: 'waiting',
		choices: getRandomCharacters(characters, nCharacters)
	};

}

export function chooseCharacter(choices: Character[], id: number, nCharacters: number): RankingState<Character> {
    choices.forEach(character => {
        if (character.id != id) {
            losers.push(character);
            remaining.pop(remaining.findIndex(character));
        }
    });

    return nextStage(remaining, nCharacters);
}

function getRandomCharacters(characters: Character[], count: number) {
	return [...characters].sort(() => Math.random() - 0.5).slice(0, count);
}

