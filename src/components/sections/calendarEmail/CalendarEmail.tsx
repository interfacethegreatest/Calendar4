
import React from 'react'
import { IoSearch } from 'react-icons/io5'
import style from "./style.module.css";
import Tooltip from '@/components/misc/Tooltip/Tooltip';
import EntrySearch from '../EntrySearch/EntrySearch';

type Props = {}

const calendarEmail = (props: Props) => {
  return (
    <>
      <EntrySearch
      iconClassName={style.searchIcon}
      iconStyle={{ marginRight: "22px" }}
      tooltipLabel="Search"
      tooltipSymbol="/"
      title="Search"
    />
    </>
  )
}

export default calendarEmail
