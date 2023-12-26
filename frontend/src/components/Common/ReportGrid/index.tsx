import React from 'react'
import { Grid } from '@mui/material'
import { ReportCard } from '@src/components/Common/ReportGrid/ReportCard'
import { GRID_CONFIG } from '@src/constants/commons'
import { ReportCardItemProps } from '@src/components/Common/ReportGrid/ReportCardItem'
import { StyledGrid } from '@src/components/Common/ReportGrid/style'

export interface ReportGridProps {
  lastGrid?: boolean
  reportDetails: ReportDetailProps[]
}

export interface ReportDetailProps {
  title: string
  items?: ReportCardItemProps[] | null
}

export const ReportGrid = ({ lastGrid, reportDetails }: ReportGridProps) => {
  const getXS = (index: number) => {
    if (needTakeUpAWholeLine(index)) {
      return GRID_CONFIG.FULL.XS
    } else if (reportDetails.length > 1) {
      return GRID_CONFIG.HALF.XS
    } else {
      return GRID_CONFIG.FULL.XS
    }
  }

  const needTakeUpAWholeLine = (index: number) => {
    const size = reportDetails.length
    const isOddSize = size % 2 === 1
    return isOddSize && lastGrid && size - 1 == index
  }

  return (
    <StyledGrid container justifyContent='start' spacing='1.5rem'>
      {reportDetails.map((detail, index) => {
        const xs = getXS(index)
        return (
          <Grid item xs={xs} key={index}>
            <ReportCard title={detail.title} items={detail.items} xs={xs} />
          </Grid>
        )
      })}
    </StyledGrid>
  )
}
