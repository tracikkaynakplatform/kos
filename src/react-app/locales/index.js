import en from './en';
import tr from './tr';

export const defaultLanguage = 'tr';
export const languages = { en, tr }
export function translate(key) {
	return (languages[defaultLanguage][key] ?? 'Undefined translate');
}