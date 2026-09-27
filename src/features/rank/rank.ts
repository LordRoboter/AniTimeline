import { AnimeCharactersDocument, type Character } from '../../../graphql/generated';
import { anilist } from '$lib/anilist/client';
import { PUBLIC_USE_TEST_DATA } from '$env/static/public';
import { testCharacters } from '$lib/mock/characters';

const useTestData = PUBLIC_USE_TEST_DATA === 'true';

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

