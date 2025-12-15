
type Props = {
    description: Array<string>;
}

const DescriptionBox = ({ description }: Props) => {
    return (
        // <div className={classes.descriptionbox}>
        //     <div className={classes.descriptionboxNavigator}>
        //         <div className={classes.descriptionboxNavBox}>Description</div>
        //     </div>
        //     <div className={classes.descriptionboxDescription}>
                // {description.map((desc, i) => {
                //     return <p key={i}>{desc}</p>
                // })}
        //     </div>

        // </div>

       <div className="lg:col-span-3">
        <div className="border-b border-gray-300">
          <nav className="flex gap-4">
            <a href="#" title="" className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900 hover:border-gray-400 hover:text-gray-800"> Description </a>

            <a href="#" title="" className="inline-flex items-center border-b-2 border-transparent py-4 text-sm font-medium text-gray-600">
              Reviews
              <span className="ml-2 block rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100"> 1,209 </span>
            </a>
          </nav>
        </div>

        <div className="mt-8 flow-root sm:mt-12">
            {
                description.map((desc, i) => {
                    return <p key={i} className="leading-relaxed">{desc}</p>
                })
            }
        </div>
      </div>
    )
}
export default DescriptionBox