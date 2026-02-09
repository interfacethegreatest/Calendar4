import style from './style.module.css'
import React from 'react'
import { MdOutlineChevronLeft } from "react-icons/md";
import { MdOutlineChevronRight } from "react-icons/md";
import Tooltip from '../Tooltip/Tooltip';
type Props = {}

const WeeklyShift = (props: Props) => {
  return (
    <>
     <div className={style.panel}>
      <Tooltip label={'Previous Week'} symbol='U' children={undefined}>
       <MdOutlineChevronLeft className={style.arrow} size={19}/>
      </Tooltip>
      <Tooltip label={'Next Week'} symbol='I' children={undefined}>
      <MdOutlineChevronRight className={style.secondArrow} size={19}/>
      </Tooltip>
     </div>
    </>
  )
}

export default WeeklyShift
