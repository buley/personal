/**
 * ContentSkeleton -- Exactly matches content layout to prevent CLS
 */
const ContentSkeleton = () => {
    return (
      // Match the exact flex layout of the content container
      <div className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-center justify-center">
        <div className="w-full max-w-5xl animate-fadeIn  md:px-12">
          {/* Content skeleton */}
          <div className="
            max-w-[38em]
            space-y-8
            mb-24
            md:mb-32
            h-[calc(100vh-16rem)]
            min-h-[calc(100vh-16rem)]
            overflow-y-auto
          ">
            {/* Main content blocks */}
            <div className="space-y-8">
              <div className="h-14 bg-white/5 w-3/4 rounded" />
              
              <div className="space-y-4">
                <div className="h-7 bg-white/5 w-full rounded" />
                <div className="h-7 bg-white/5 w-11/12 rounded" />
                <div className="h-7 bg-white/5 w-full rounded" />
                <div className="h-7 bg-white/5 w-4/5 rounded" />
              </div>
  
              <div className="h-12 bg-white/5 w-1/2 rounded" />
              
              <div className="space-y-4">
                <div className="h-7 bg-white/5 w-full rounded" />
                <div className="h-7 bg-white/5 w-11/12 rounded" />
                <div className="h-7 bg-white/5 w-full rounded" />
              </div>
  
              <div className="space-y-3 pl-4">
                <div className="h-7 bg-white/5 w-11/12 rounded" />
                <div className="h-7 bg-white/5 w-10/12 rounded" />
                <div className="h-7 bg-white/5 w-11/12 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ContentSkeleton;