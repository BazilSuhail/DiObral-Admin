
const LoadingSpinner = () => {
  return (
    <div class="flex-col gap-4 w-full scale-[0.7] flex items-center justify-center">
      <div
        class="w-20 h-20 border-4 border-transparent text-red-700 text-4xl animate-spin flex items-center justify-center border-t-red-700 rounded-full"
      >
        <div
          class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
        ></div>
      </div>
    </div>
  )
}

export default LoadingSpinner
