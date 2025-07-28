export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-0 animate-pulse">
      <div className="w-full h-48 bg-fur-gray/20"></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="h-5 bg-fur-gray/20 rounded w-24"></div>
          <div className="h-4 bg-fur-gray/20 rounded w-12"></div>
        </div>
        <div className="h-4 bg-fur-gray/20 rounded w-32 mb-2"></div>
        <div className="flex items-center gap-4 mb-3">
          <div className="h-3 bg-fur-gray/20 rounded w-16"></div>
          <div className="h-3 bg-fur-gray/20 rounded w-20"></div>
        </div>
        <div className="space-y-1 mb-3">
          <div className="h-3 bg-fur-gray/20 rounded w-28"></div>
          <div className="h-3 bg-fur-gray/20 rounded w-32"></div>
          <div className="h-3 bg-fur-gray/20 rounded w-36"></div>
        </div>
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-fur-gray/20 rounded w-16"></div>
          <div className="h-5 bg-fur-gray/20 rounded w-14"></div>
        </div>
        <div className="h-9 bg-fur-gray/20 rounded w-full"></div>
      </div>
    </div>
  )
}
