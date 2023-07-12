import {useState} from "react";
import {ActionsMenu} from "../../common/actions/actions-menu";

const RangeSelector = ({onChange}) => {
  const [range, setRange] = useState('Last 7 days');
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
      label={range}
      size="small"
      variant="text"
    />
  )
}

export default RangeSelector