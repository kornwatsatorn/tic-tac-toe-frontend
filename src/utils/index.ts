export const getNestedError = <T>(obj: T, path: string): boolean => {
  const _res = path
    .split(".")
    .reduce((acc, part) => acc && (acc as any)[part], obj)
  return _res ? true : false
}

export const getErrorResponseOnCatch = (error: any) => {
  return error?.response?.data?.error ?? error?.code ?? error ?? ""
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}
