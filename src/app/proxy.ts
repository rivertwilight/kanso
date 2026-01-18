import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
 
let headers = { 'accept-language': 'en,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en', 'zh']
let defaultLocale = 'en'
 
match(languages, locales, defaultLocale) // -> 'en'