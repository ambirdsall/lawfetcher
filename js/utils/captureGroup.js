export default function captureGroup(pattern, string, num=1) {
  const matchData = string.match(pattern)

  return matchData && matchData[num]
}
