import translations from '@/i18n/translations'
import campaign from '@/i18n/campaign'
import stages from '@/i18n/stageTranslations'
import { mergeObjectsRecursive } from '@/utils/function'

const mergeTranslations = () => {
  return mergeObjectsRecursive({}, mergeObjectsRecursive(stages, mergeObjectsRecursive(campaign, translations)))
}
const messages = mergeTranslations()
export default messages
