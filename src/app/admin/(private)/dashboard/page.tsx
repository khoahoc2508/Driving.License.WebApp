// MUI Imports

import dynamic from 'next/dynamic'


// Next Imports

// Component Imports



// Data Imports

const OverViewTab = dynamic(() => import('@views/dashboard/overview'))

// const RevenueTab = dynamic(() => import('@views/dashboard/revenue'))

// Vars
// const tabContentList = (): { [key: string]: ReactElement } => ({
//   overview: <OverViewTab />,
//   revenue: <RevenueTab />
// })

const dashboard = async () => {
  return (

    // <Grid container spacing={6}>
    //   <Grid size={{ xs: 12 }}>
    //     {/* <ExamSchedulesTable /> */}
    //     <Dashboard tabContentList={tabContentList()} />
    //   </Grid>
    // </Grid>
    <OverViewTab />
  )
}

export default dashboard
