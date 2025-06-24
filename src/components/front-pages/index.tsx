// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from './Footer'
import Header from './Header'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

const FrontLayout = async ({ children }: ChildrenType) => {
  // Vars
  const mode = await getServerMode()

  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} />
      {children}
      <Footer />
    </div>
  )
}

export default FrontLayout
