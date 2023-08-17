import dynamic from "next/dynamic"

const MobileSheetWrapper = dynamic(() => import("./mobile-sheet-wrapper"))

export function MobileNav() {
  return (
    <MobileSheetWrapper>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto commodi
      officiis repudiandae, neque cum aliquid tempore adipisci amet quam fugiat!
    </MobileSheetWrapper>
  )
}
