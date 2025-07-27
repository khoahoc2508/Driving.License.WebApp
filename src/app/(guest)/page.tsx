import { getServerMode } from "@/@core/utils/serverHelpers"
import Home from "@/views/home"

const Page = async () => {

  const mode = await getServerMode()

  return <Home mode={mode} />
}

export default Page
