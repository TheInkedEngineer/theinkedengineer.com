import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { ProjectsPageClient } from "@/components/projects/projects-page-client"

export default function ProjectsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ProjectsPageClient />
      </Suspense>
      <Navigation />
    </>
  )
}
