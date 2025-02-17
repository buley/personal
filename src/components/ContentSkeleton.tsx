/**
 * ContentSkeleton - Exactly matches content layout to prevent CLS
 */
const ContentSkeleton = () => {
    return (
      // Match the exact flex layout of the content container
      <div className="relative z-30 min-h-screen px-6 py-16 md:py-24 flex items-center justify-center">
        <div className="w-full max-w-5xl animate-fadeIn px-6 md:px-12">
          {/* Title skeleton */}
          <div className="text-5xl md:text-7xl font-bold mb-12 tracking-tight h-16 md:h-24 bg-white/5 w-2/3 rounded" />
          
          {/* Content skeleton */}
          <div className="
            max-w-[38em]
            space-y-8
            mb-24
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