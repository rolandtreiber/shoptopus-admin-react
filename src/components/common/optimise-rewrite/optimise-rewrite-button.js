import {useCallback, useContext} from "react";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {APIContext} from "../../../contexts/api-context";
import {useMounted} from "../../../hooks/use-mounted";
import TrButton from "../translated/translated-button";

const OptimiseRewriteButton = ({text, targetLanguages, optimisedTextsFetched, setOperationInProgress}) => {
  const {fetchTextOptimisations} = useContext(APIContext)
  const mounted = useMounted();
  const { t } = useTranslation();

  const handleGetOptimisations = useCallback(async () => {
    setOperationInProgress(true)
    try {
      const {data} = await fetchTextOptimisations({
        text: text,
        target_languages: targetLanguages
      })
      optimisedTextsFetched(data)

    } catch (err) {
      console.error(err);

      if (mounted.current) {
        toast.error(t('Optimised text could not be fetched'));
      }
    } finally {
      setOperationInProgress(false)
    }
  }, [text, targetLanguages])

  return <><TrButton sx={{
    marginLeft: 1
  }} variant="outlined" onClick={handleGetOptimisations}>Improve with AI</TrButton></>
}

export default OptimiseRewriteButton;