"use client"

import { useLoading } from "@/context/LoadingContext"
import { formatTime } from "@/utils"
import fetchApi from "@/utils/axios"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import Style from "./style.module.css"
import classNames from "classnames"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import ImageWrapper from "@/components/utils/ImageWrapper"
import { EMatchType } from "@/utils/enum"

interface IPlayer {
  player1: string
  player2: string
}

const HomePage = () => {
  // import
  const { setLoading } = useLoading()
  const { data: session, update } = useSession()
  const { t } = useTranslation()
  // variable
  /**
   * step
   * 0 is ready to join
   * 1 is waiting match
   * 2 is playing
   * 3 is game end show winner
   */
  const [step, setStep] = useState<number>(0)
  const [timeCounter, setTimeCounter] = useState<number>(0)
  const [intervalData, setIntervalData] = useState<NodeJS.Timeout>()
  const [matchId, setMatchId] = useState<string>("")
  const [replay, setReplay] = useState<any[]>([])
  const [player, setPlayer] = useState<IPlayer | null>()
  const [disabledSlot, setDisabledSlot] = useState<boolean>(false)
  const [isWinner, setIsWinner] = useState<boolean | null | undefined>(
    undefined
  )

  // methods
  const handleJoinMatch = async (mode: EMatchType = EMatchType.BOT) => {
    await initMatch(`/match?type=${mode}`)
  }

  const handleSelectSlot = async (slot: number) => {
    try {
      if (disabledSlot) {
        throw new Error("Opponent turn")
      }
      setDisabledSlot(true)
      const _res = await fetchApi.post("/match/play", {
        data: { slot, matchId },
      })
    } catch (error) {
      setDisabledSlot(false)
    }
  }

  const handleInitMatch = async () => {
    await initMatch(`/match/init`)
  }

  const handleLeave = async () => {
    try {
      await fetchApi.post("/match/leave", {
        data: { matchId },
      })
    } catch (error) {}
  }

  // utile
  const initMatch = async (url: string) => {
    try {
      setLoading(true)
      setIsWinner(undefined)
      const _res = await fetchApi.get(url)
      const _data = _res.data.data.data
      setMatchId(_data.match._id)
      setReplay(_data.match.replay)
      if (_data.match.status === "waiting") {
        const _diffTime =
          new Date().getTime() - new Date(_data.match.createdAt).getTime()
        // new Date().getTime() -  new Date('2024-09-11T09:20:40.880Z').getTime()
        console.log(
          "%csrc/app/(pages)/page.tsx:79 _diffTime",
          "color: #007acc;",
          _diffTime
        )
        setTimeCounter(Math.floor(_diffTime / 1000))
        setStep(1)
      } else if (_data.match.status === "playing") {
        updateActiveSlot(_data.currentTurn)
        setDataPlayer(_data.match)
        setStep(2)
      }
    } catch (error) {
      console.log(
        "%csrc/app/(pages)/page.tsx:59 error",
        "color: #007acc;",
        error
      )
    } finally {
      setLoading(false)
    }
  }

  const getValueSlot = (slot: number) => {
    let _value = null
    const _find = replay.find((_replay) => _replay.slot === slot)
    if (_find) {
      _value =
        _find.player === player?.player1 ? "/images/x.png" : "/images/o.png"
    }
    return _value
  }

  const setDataPlayer = (_match: any) => {
    setPlayer({
      player1: _match.player1,
      player2: _match.player2,
    })
  }

  const updatePointSession = async (
    point: number,
    botWinStack: number | null = null
  ) => {
    const _data = {
      ...session?.user,
      point: point,
    }
    if (botWinStack !== null) {
      _data.botWinStack = botWinStack
    }
    await update({
      user: _data,
    })
  }
  const updateActiveSlot = (player: string) => {
    setDisabledSlot(session?.id !== player)
  }

  // init
  useEffect(() => {
    handleInitMatch()
  }, [])

  // watch connect sse
  useEffect(() => {
    if (matchId) {
      const eventSource = new EventSource(`/api/sse/${matchId}`)

      // // Listen for events
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.message) {
          updateActiveSlot(data.currentTurn)
          if (data.message === "START") {
            setDataPlayer(data.match)
            setStep(2)
          } else if (data.message === "UPDATE") {
            setReplay(data.match.replay)
          } else if (data.message === "END") {
            // reset
            if (session?.id === data.match.player1) {
              updatePointSession(data.point.player1, data.stack)
            } else {
              updatePointSession(data.point.player2)
            }

            if (data.match.winner === null) {
              setIsWinner(null)
            } else {
              setIsWinner(data.match.winner === session?.id)
            }
            setDisabledSlot(true)
            setReplay([])
            setMatchId("")
            setPlayer(null)
            setStep(3)
            eventSource.close()
          } else if (data.message === "CANCEL") {
            setStep(0)
          }
        }
      }

      // // Error handling
      eventSource.onerror = (error) => {
        console.error("SSE error:", error)
        eventSource.close()
      }

      // // Clean up when component unmounts
      return () => {
        eventSource.close()
      }
    }
  }, [matchId])

  // Effect to start the counter when step is set to 1
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (step === 1) {
      // Start the counter when step is 1
      intervalId = setInterval(() => {
        setTimeCounter((prev) => prev + 1)
      }, 1000)
      setIntervalData(intervalId)
    } else {
      clearInterval(intervalData)
    }
  }, [step])

  // render
  return (
    <section className="d-flex justify-content-center align-items-center height-same-outer">
      {/* button play */}
      {step === 0 && (
        <Container>
          <Row className="gap-3">
            <Col xs={12} className="text-center">
              <Button
                variant="primary"
                onClick={() => handleJoinMatch(EMatchType.PLAYER)}
              >
                {t("label.online")}
              </Button>
            </Col>
            <Col xs={12} className="text-center">
              <div>
                <Button variant="secondary" onClick={() => handleJoinMatch()}>
                  {t("label.bot")}
                  <span className="d-flex">
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <ImageWrapper
                          key={i}
                          src="/images/stack.png"
                          width="20px"
                          height="20px"
                          className={classNames(
                            (session?.user?.botWinStack ?? 0) > i
                              ? ""
                              : "grayscale"
                          )}
                        />
                      ))}
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}

      {step === 1 && (
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <h2>{formatTime(timeCounter)}</h2>
            </Col>
            <Col xs={12} className="text-center">
              <Button onClick={handleLeave}>{t("label.leave")}</Button>
            </Col>
          </Row>
        </Container>
      )}

      {step === 2 && (
        <Container>
          <div className={classNames(Style["panel-game"])}>
            <Row>
              <Col xs={12} className="d-flex align-items-center flex-column">
                <h1 className="mb-0">
                  {!disabledSlot ? (
                    <>{t("label.turn.you")}</>
                  ) : (
                    <>{t("label.turn.opponent")}</>
                  )}
                </h1>
                <div className="d-flex align-items-center">
                  <p className="mb-0">You icon : </p>
                  <ImageWrapper
                    src={
                      player?.player1 === session?.id
                        ? "/images/x.png"
                        : "/images/o.png"
                    }
                    width="40px"
                    height="40px"
                    notPlaceholder={false}
                  />
                </div>
              </Col>
              <Col xs={12}>
                <hr />
              </Col>
            </Row>
            <Row className={classNames(Style["board-game"])}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_slot: number) => (
                <Col
                  xs={4}
                  key={_slot}
                  onClick={() => {
                    const _check = getValueSlot(_slot)
                    if (_check) {
                      return
                    }
                    handleSelectSlot(_slot)
                  }}
                >
                  <div className="ratio ratio-1x1">
                    <div className=" d-flex justify-content-center align-items-center">
                      {/* {_slot} */}
                      {getValueSlot(_slot) && (
                        <ImageWrapper src={getValueSlot(_slot)} />
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      )}

      {step === 3 && (
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <h2>{t("label.gameover")}</h2>
              <h3>
                {typeof isWinner === "boolean"
                  ? isWinner
                    ? t("label.winner")
                    : t("label.loser")
                  : t("label.draw")}
              </h3>
              <Button onClick={() => setStep(0)}>Ok</Button>
            </Col>
          </Row>
        </Container>
      )}
    </section>
  )
}

export default HomePage
