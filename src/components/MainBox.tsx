import { StyleSheet, Dimensions, View, Alert } from "react-native";
import Icon from "./Icon";
import { useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import { Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

const wrapperWidth = Dimensions.get("window").width - 42;
const boxSize = wrapperWidth / 3;

const MainBox = () => {

  const winningLogic = useMemo(() => [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ], []);

  const [reservedBlocks, setReservedBlocks] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const [turn, setTurn] = useState<"x" | "o">("x");
  const [xValues, setXValues] = useState<number[]>([]);
  const [oValues, setOValues] = useState<number[]>([]);

  const handleReserveBlock = ({ blockNumber, player }: { blockNumber: number, player: string }) => {
    if (player === "x") {
      const existClickedBlock = xValues.includes(blockNumber) || oValues.includes(blockNumber);
      if (existClickedBlock) {
        return;
      }
      const newXValues = [...xValues, blockNumber];
      const sortedXValues = newXValues.sort((a, b) => a - b);
      setXValues(sortedXValues);
    } else {
      const existClickedBlock = xValues.includes(blockNumber) || oValues.includes(blockNumber);
      if (existClickedBlock) {
        return;
      }
      const newOValues = [...oValues, blockNumber];
      const sortedOValues = newOValues.sort((a, b) => a - b);
      setOValues(sortedOValues);
    }

    setTurn((prev) => (prev === "x" ? "o" : "x"));
    const alreadyChoosenBlocks = [...xValues, ...oValues, blockNumber].sort((a, b) => a - b);
    setReservedBlocks(alreadyChoosenBlocks);
  };

  const checkWinningPlayer = () => {
    if (winningLogic.some((combo) =>
      combo.every((value) => xValues.includes(value))
    )) {
      setIsGameOver(true);
      Alert.alert("Winner", "X is the winner!");
    } else if (winningLogic.some((combo) =>
      combo.every((value) => oValues.includes(value))
    )) {
      setIsGameOver(true);
      Alert.alert("Winner", "O is the winner!");
    }
  };

  const isOver = winningLogic.some((combo) =>
    combo.every((value) => xValues.includes(value))
  ) || winningLogic.some((combo) =>
    combo.every((value) => oValues.includes(value))
  )

  const handleReset = () => {
    setReservedBlocks([]);
    setIsGameOver(false);
    setTurn("x");
    setXValues([]);
    setOValues([]);
  };

  const playerOAutoPlay = () => {
    if (isGameOver || turn !== "o") return;

    const allBlocks = Array.from({ length: 9 }, (_, i) => i);
    const availableBlocks = allBlocks.filter((block) => !reservedBlocks.includes(block));
    if (availableBlocks.length === 0) return;

    const findWinningMove = (playerValues: number[]) => {
      for (let combo of winningLogic) {
        const availableInCombo = combo.filter((cell) => !playerValues.includes(cell));
        if (availableInCombo.length === 1) {
          const targetCell = availableInCombo[0];
          if (availableBlocks.includes(targetCell)) {
            return targetCell;
          }
        }
      }
      return null;
    };

    const winMove = findWinningMove(oValues);
    if (winMove !== null) {
      handleReserveBlock({ blockNumber: winMove, player: "o" });
      return;
    }

    const blockMove = findWinningMove(xValues);
    if (blockMove !== null) {
      handleReserveBlock({ blockNumber: blockMove, player: "o" });
      return;
    }

    const center = 4;
    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];

    let strategicMove = null;

    if (availableBlocks.includes(center)) {
      strategicMove = center;
    }
    else {
      const availableCorners = corners.filter((c) => availableBlocks.includes(c));
      if (availableCorners.length > 0) {
        strategicMove = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      } else {
        const availableEdges = edges.filter((e) => availableBlocks.includes(e));
        strategicMove = availableEdges[Math.floor(Math.random() * availableEdges.length)];
      }
    }

    if (strategicMove !== null) {
      handleReserveBlock({ blockNumber: strategicMove, player: "o" });
      return;
    }

    const randomBlock = availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
    handleReserveBlock({ blockNumber: randomBlock, player: "o" });
  };


  useEffect(() => {
    if (turn === "o") {
      setTimeout(() => {
        playerOAutoPlay();
      }, 1500);
    }

    if (isOver) {
      setTimeout(() => {
        checkWinningPlayer();
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xValues, oValues]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <Entypo name="game-controller" size={25} />
        <Text style={styles.headingText}>Tic Tac Toe</Text>
      </View>
      <View style={styles.container}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((blockNumber) => (
          <Pressable
            onPress={() => {
              handleReserveBlock({ blockNumber, player: turn });
            }}
            disabled={isGameOver || reservedBlocks.includes(blockNumber)}
            key={blockNumber} style={styles.block}>
            {reservedBlocks.includes(blockNumber) && (
              <Icon iconName={xValues.includes(blockNumber) ? "x" : "circle"} />
            )}
          </Pressable>))}
      </View>

      <View style={styles.turn}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ backgroundColor: turn === "x" ? "red" : "purple" }}>
          <Text style={styles.turnLable}>Now, {turn} Turn</Text>
        </View>
      </View>

      <Pressable
        style={styles.button}
        onPress={handleReset}
      >
        <Text>Reload Game</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  block: {
    width: boxSize,
    height: boxSize,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  turn: {
    fontWeight: "semibold",
    padding: 10,
  },
  turnLable: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  button: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  }
});

export default MainBox;