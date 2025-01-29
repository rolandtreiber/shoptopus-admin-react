import {useCallback, useContext} from "react";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import TrButton from "../translated/translated-button";

const TranslateButton = ({text, targetLanguages, translationsFetched, setOperationInProgress}) => {
  const {fetchTextTranslations} = useContext(APIContext)
  const mounted = useMounted();
  const { t } = useTranslation();

  const handleGetTranslations = useCallback(async () => {
    setOperationInProgress(true)
    try {
      const {data} = await fetchTextTranslations({
        text: text,
        target_languages: targetLanguages
      })
      translationsFetched(data)

    } catch (err) {
      console.error(err);

      if (mounted.current) {
        toast.error(t('Translations could not be fetched'));
      }
    } finally {
      setOperationInProgress(false)
    }
  }, [text, targetLanguages])

  return <><TrButton variant="outlined" onClick={handleGetTranslations}>Translate</TrButton></>
}

export default TranslateButton;