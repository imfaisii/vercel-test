"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, X, RefreshCw, ArrowRight } from "lucide-react"

type Matrix = number[][]

export default function MatrixCalculator() {
  const [matrixA, setMatrixA] = useState<Matrix>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])
  const [matrixB, setMatrixB] = useState<Matrix>([
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1],
  ])
  const [result, setResult] = useState<Matrix | null>(null)
  const [operation, setOperation] = useState<string>("add")
  const [rowsA, setRowsA] = useState<number>(3)
  const [colsA, setColsA] = useState<number>(3)
  const [rowsB, setRowsB] = useState<number>(3)
  const [colsB, setColsB] = useState<number>(3)
  const [error, setError] = useState<string>("")
  const [scalar, setScalar] = useState<number>(2)

  // Initialize a matrix with zeros
  const initializeMatrix = (rows: number, cols: number): Matrix => {
    return Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))
  }

  // Handle matrix dimension changes
  const handleMatrixADimensionChange = (rows: number, cols: number) => {
    setRowsA(rows)
    setColsA(cols)
    setMatrixA(initializeMatrix(rows, cols))
    setResult(null)
  }

  const handleMatrixBDimensionChange = (rows: number, cols: number) => {
    setRowsB(rows)
    setColsB(cols)
    setMatrixB(initializeMatrix(rows, cols))
    setResult(null)
  }

  // Handle matrix cell value changes
  const handleMatrixAChange = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value)
    const newMatrix = [...matrixA]
    newMatrix[rowIndex][colIndex] = newValue
    setMatrixA(newMatrix)
    setResult(null)
  }

  const handleMatrixBChange = (rowIndex: number, colIndex: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value)
    const newMatrix = [...matrixB]
    newMatrix[rowIndex][colIndex] = newValue
    setMatrixB(newMatrix)
    setResult(null)
  }

  // Matrix operations
  const addMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      setError("Matrices must have the same dimensions for addition")
      return null
    }

    return a.map((row, i) => row.map((val, j) => val + b[i][j]))
  }

  const subtractMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      setError("Matrices must have the same dimensions for subtraction")
      return null
    }

    return a.map((row, i) => row.map((val, j) => val - b[i][j]))
  }

  const multiplyMatrices = (a: Matrix, b: Matrix): Matrix | null => {
    if (a[0].length !== b.length) {
      setError("Number of columns in first matrix must equal number of rows in second matrix")
      return null
    }

    const result: Matrix = Array(a.length)
      .fill(0)
      .map(() => Array(b[0].length).fill(0))

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < a[0].length; k++) {
          result[i][j] += a[i][k] * b[k][j]
        }
      }
    }

    return result
  }

  const multiplyByScalar = (matrix: Matrix, scalar: number): Matrix => {
    return matrix.map((row) => row.map((val) => val * scalar))
  }

  const transposeMatrix = (matrix: Matrix): Matrix => {
    const rows = matrix.length
    const cols = matrix[0].length
    const result: Matrix = Array(cols)
      .fill(0)
      .map(() => Array(rows).fill(0))

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = matrix[i][j]
      }
    }

    return result
  }

  const calculateDeterminant = (matrix: Matrix): number => {
    const n = matrix.length

    if (n !== matrix[0].length) {
      setError("Matrix must be square to calculate determinant")
      return Number.NaN
    }

    if (n === 1) {
      return matrix[0][0]
    }

    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    }

    let det = 0
    for (let j = 0; j < n; j++) {
      det += matrix[0][j] * cofactor(matrix, 0, j)
    }

    return det
  }

  const cofactor = (matrix: Matrix, row: number, col: number): number => {
    const minor = getMinor(matrix, row, col)
    return Math.pow(-1, row + col) * calculateDeterminant(minor)
  }

  const getMinor = (matrix: Matrix, row: number, col: number): Matrix => {
    const minor: Matrix = []
    const n = matrix.length

    for (let i = 0; i < n; i++) {
      if (i === row) continue

      const newRow: number[] = []
      for (let j = 0; j < n; j++) {
        if (j === col) continue
        newRow.push(matrix[i][j])
      }
      minor.push(newRow)
    }

    return minor
  }

  const calculateInverse = (matrix: Matrix): Matrix | null => {
    const n = matrix.length

    if (n !== matrix[0].length) {
      setError("Matrix must be square to calculate inverse")
      return null
    }

    const det = calculateDeterminant(matrix)

    if (Math.abs(det) < 1e-10) {
      setError("Matrix is singular, inverse does not exist")
      return null
    }

    if (n === 1) {
      return [[1 / matrix[0][0]]]
    }

    const adjugate: Matrix = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        adjugate[j][i] = cofactor(matrix, i, j) / det
      }
    }

    return adjugate
  }

  // Perform the selected operation
  const performOperation = () => {
    setError("")
    let calculatedResult: Matrix | null = null

    switch (operation) {
      case "add":
        calculatedResult = addMatrices(matrixA, matrixB)
        break
      case "subtract":
        calculatedResult = subtractMatrices(matrixA, matrixB)
        break
      case "multiply":
        calculatedResult = multiplyMatrices(matrixA, matrixB)
        break
      case "scalar":
        calculatedResult = multiplyByScalar(matrixA, scalar)
        break
      case "transpose":
        calculatedResult = transposeMatrix(matrixA)
        break
      case "determinant":
        const det = calculateDeterminant(matrixA)
        if (!isNaN(det)) {
          setResult([[det]])
        }
        return
      case "inverse":
        calculatedResult = calculateInverse(matrixA)
        break
      default:
        setError("Invalid operation")
        return
    }

    if (calculatedResult) {
      setResult(calculatedResult)
    }
  }

  // Reset matrices to default values
  const resetMatrices = () => {
    setMatrixA([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])
    setMatrixB([
      [9, 8, 7],
      [6, 5, 4],
      [3, 2, 1],
    ])
    setRowsA(3)
    setColsA(3)
    setRowsB(3)
    setColsB(3)
    setResult(null)
    setError("")
  }

  // Render a matrix input
  const renderMatrixInput = (
    matrix: Matrix,
    handleChange: (rowIndex: number, colIndex: number, value: string) => void,
  ) => {
    return (
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              className="w-12 h-12 text-center p-0"
            />
          )),
        )}
      </div>
    )
  }

  // Render a matrix display
  const renderMatrix = (matrix: Matrix) => {
    return (
      <div className="border rounded-md p-2 inline-block">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-12 h-12 flex items-center justify-center border-r border-b last:border-r-0 last-of-type:border-b-0"
              >
                {Number.isInteger(cell) ? cell : cell.toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About Matrix Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Matrix A Dimensions</Label>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={rowsA.toString()}
                          onValueChange={(value) => handleMatrixADimensionChange(Number.parseInt(value), colsA)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Rows" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>×</span>
                        <Select
                          value={colsA.toString()}
                          onValueChange={(value) => handleMatrixADimensionChange(rowsA, Number.parseInt(value))}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Columns" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Matrix A</Label>
                      {renderMatrixInput(matrixA, handleMatrixAChange)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Operation</Label>
                      <Select value={operation} onValueChange={setOperation}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Addition (A + B)</SelectItem>
                          <SelectItem value="subtract">Subtraction (A - B)</SelectItem>
                          <SelectItem value="multiply">Multiplication (A × B)</SelectItem>
                          <SelectItem value="scalar">Scalar Multiplication (k × A)</SelectItem>
                          <SelectItem value="transpose">Transpose (Aᵀ)</SelectItem>
                          <SelectItem value="determinant">Determinant (|A|)</SelectItem>
                          <SelectItem value="inverse">Inverse (A⁻¹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {operation === "scalar" && (
                      <div>
                        <Label htmlFor="scalar" className="mb-2 block">
                          Scalar Value (k)
                        </Label>
                        <Input
                          id="scalar"
                          type="number"
                          value={scalar}
                          onChange={(e) => setScalar(Number(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    )}

                    {["add", "subtract", "multiply"].includes(operation) && (
                      <>
                        <div>
                          <Label className="mb-2 block">Matrix B Dimensions</Label>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={rowsB.toString()}
                              onValueChange={(value) => handleMatrixBDimensionChange(Number.parseInt(value), colsB)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Rows" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>×</span>
                            <Select
                              value={colsB.toString()}
                              onValueChange={(value) => handleMatrixBDimensionChange(rowsB, Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="Columns" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="mb-2 block">Matrix B</Label>
                          {renderMatrixInput(matrixB, handleMatrixBChange)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-6 space-x-4">
                  <Button onClick={performOperation}>Calculate</Button>
                  <Button variant="outline" onClick={resetMatrices}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {result && (
                  <div className="mt-6">
                    <Label className="mb-2 block text-center">Result</Label>
                    <div className="flex items-center justify-center">
                      {operation === "add" && (
                        <>
                          {renderMatrix(matrixA)}
                          <Plus className="mx-4" />
                          {renderMatrix(matrixB)}
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "subtract" && (
                        <>
                          {renderMatrix(matrixA)}
                          <Minus className="mx-4" />
                          {renderMatrix(matrixB)}
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "multiply" && (
                        <>
                          {renderMatrix(matrixA)}
                          <X className="mx-4" />
                          {renderMatrix(matrixB)}
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "scalar" && (
                        <>
                          <span className="mx-2 text-lg">{scalar}</span>
                          <X className="mx-2" />
                          {renderMatrix(matrixA)}
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "transpose" && (
                        <>
                          {renderMatrix(matrixA)}
                          <span className="mx-4 text-lg">ᵀ</span>
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "determinant" && (
                        <>
                          <div className="mx-2 text-lg">|</div>
                          {renderMatrix(matrixA)}
                          <div className="mx-2 text-lg">|</div>
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {operation === "inverse" && (
                        <>
                          {renderMatrix(matrixA)}
                          <span className="mx-4 text-lg">⁻¹</span>
                          <ArrowRight className="mx-4" />
                        </>
                      )}
                      {renderMatrix(result)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h3>Matrix Operations</h3>
                <p>
                  Matrices are rectangular arrays of numbers arranged in rows and columns. They are powerful
                  mathematical tools used in various fields including physics, computer graphics, economics, and more.
                </p>

                <h4>Basic Operations</h4>
                <ul>
                  <li>
                    <strong>Addition:</strong> Add corresponding elements of two matrices of the same dimensions.
                  </li>
                  <li>
                    <strong>Subtraction:</strong> Subtract corresponding elements of two matrices of the same
                    dimensions.
                  </li>
                  <li>
                    <strong>Scalar Multiplication:</strong> Multiply each element of a matrix by a scalar value.
                  </li>
                  <li>
                    <strong>Matrix Multiplication:</strong> Multiply two matrices A and B if the number of columns in A
                    equals the number of rows in B.
                  </li>
                </ul>

                <h4>Advanced Operations</h4>
                <ul>
                  <li>
                    <strong>Transpose:</strong> Flip a matrix over its diagonal, switching rows and columns.
                  </li>
                  <li>
                    <strong>Determinant:</strong> A scalar value calculated from a square matrix that has various
                    interpretations (area scaling factor, solvability of linear equations).
                  </li>
                  <li>
                    <strong>Inverse:</strong> A matrix that, when multiplied by the original matrix, gives the identity
                    matrix. Only square matrices with non-zero determinants have inverses.
                  </li>
                </ul>

                <h4>Applications</h4>
                <p>Matrix operations are essential in many applications:</p>
                <ul>
                  <li>Solving systems of linear equations</li>
                  <li>Computer graphics and 3D transformations</li>
                  <li>Data analysis and statistics</li>
                  <li>Quantum mechanics</li>
                  <li>Economics and finance</li>
                  <li>Network analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

