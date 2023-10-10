import {useState} from "react";
import {ActionsMenu} from "../../common/actions/actions-menu";
import {useTranslation} from "react-i18next";

const RangeSelector = ({onChange}) => {
  const [range, setRange] = useState('Last 7 days');
  const { t } = useTranslation();
  const ranges = [
    {
      label: 'Last 7 days',
      onClick: () => {
        setRange('Last 7 days');
        onChange(1)
      }
    },
    {
      label: 'Last Month',
      onClick: () => {
        setRange('Last Month');
        onChange(2)
      }
    },
    {
      label: 'Last Year',
      onClick: () => {
        setRange('Last Year');
        onChange(3)
      }
    }
  ];

  return (
    <ActionsMenu
      actions={ranges}
      label={t(range)}
      size="small"
      variant="text"
    />
  )
}

export default RangeSelector