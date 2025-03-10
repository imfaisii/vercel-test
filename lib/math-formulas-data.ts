export type FormulaCategory =
  | "algebra"
  | "geometry"
  | "trigonometry"
  | "calculus"
  | "statistics"
  | "probability"
  | "complex-numbers"
  | "3d-geometry"
  | "physics"

export interface MathFormula {
  id: string
  title: string
  formula: string
  description: string
  category: FormulaCategory
  difficulty: "easy" | "medium" | "hard"
  points: number
  variables?: { symbol: string; name: string; description: string }[]
  example?: {
    problem: string
    solution: string
    steps: string[]
  }
}

// Export both formulas and mathFormulas for compatibility
export const formulas: MathFormula[] = [
  // Basic Geometry Formulas
  {
    id: "area-of-rectangle",
    title: "Area of a Rectangle",
    formula: "A = l × w",
    description: "The area of a rectangle is calculated by multiplying its length by its width.",
    category: "geometry",
    difficulty: "easy",
    points: 5,
    variables: [
      { symbol: "A", name: "Area", description: "The total space inside the rectangle" },
      { symbol: "l", name: "Length", description: "The longer side of the rectangle" },
      { symbol: "w", name: "Width", description: "The shorter side of the rectangle" },
    ],
    example: {
      problem: "Find the area of a rectangle with length 8 cm and width 5 cm.",
      solution: "A = 40 cm²",
      steps: ["A = l × w", "A = 8 cm × 5 cm", "A = 40 cm²"],
    },
  },
  {
    id: "perimeter-of-rectangle",
    title: "Perimeter of a Rectangle",
    formula: "P = 2(l + w)",
    description:
      "The perimeter of a rectangle is the total distance around its edges, calculated by adding twice the length and twice the width.",
    category: "geometry",
    difficulty: "easy",
    points: 5,
    variables: [
      { symbol: "P", name: "Perimeter", description: "The total distance around the rectangle" },
      { symbol: "l", name: "Length", description: "The longer side of the rectangle" },
      { symbol: "w", name: "Width", description: "The shorter side of the rectangle" },
    ],
    example: {
      problem: "Find the perimeter of a rectangle with length 10 m and width 6 m.",
      solution: "P = 32 m",
      steps: ["P = 2(l + w)", "P = 2(10 m + 6 m)", "P = 2(16 m)", "P = 32 m"],
    },
  },
  {
    id: "area-of-square",
    title: "Area of a Square",
    formula: "A = a²",
    description: "The area of a square is calculated by squaring the length of one side.",
    category: "geometry",
    difficulty: "easy",
    points: 5,
    variables: [
      { symbol: "A", name: "Area", description: "The total space inside the square" },
      { symbol: "a", name: "Side length", description: "The length of one side of the square" },
    ],
    example: {
      problem: "Find the area of a square with sides of length 7 cm.",
      solution: "A = 49 cm²",
      steps: ["A = a²", "A = 7² cm²", "A = 49 cm²"],
    },
  },
  {
    id: "perimeter-of-square",
    title: "Perimeter of a Square",
    formula: "P = 4a",
    description:
      "The perimeter of a square is the total distance around its edges, calculated by multiplying the side length by 4.",
    category: "geometry",
    difficulty: "easy",
    points: 5,
    variables: [
      { symbol: "P", name: "Perimeter", description: "The total distance around the square" },
      { symbol: "a", name: "Side length", description: "The length of one side of the square" },
    ],
    example: {
      problem: "Find the perimeter of a square with sides of length 5 m.",
      solution: "P = 20 m",
      steps: ["P = 4a", "P = 4 × 5 m", "P = 20 m"],
    },
  },
  {
    id: "area-of-circle",
    title: "Area of a Circle",
    formula: "A = πr²",
    description: "The area of a circle is calculated using the radius and the mathematical constant π (pi).",
    category: "geometry",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "A", name: "Area", description: "The total space inside the circle" },
      { symbol: "π", name: "Pi", description: "The mathematical constant approximately equal to 3.14159" },
      {
        symbol: "r",
        name: "Radius",
        description: "The distance from the center of the circle to any point on its edge",
      },
    ],
    example: {
      problem: "What is the area of a circle with a radius of 5 units?",
      solution: "A = 78.54 units²",
      steps: ["A = πr²", "A = π × 5²", "A = π × 25", "A ≈ 3.14159 × 25", "A ≈ 78.54 units²"],
    },
  },
  {
    id: "circumference-of-circle",
    title: "Circumference of a Circle",
    formula: "C = 2πr",
    description: "The circumference of a circle is the distance around its edge, calculated using the radius and π.",
    category: "geometry",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "C", name: "Circumference", description: "The distance around the circle" },
      { symbol: "π", name: "Pi", description: "The mathematical constant approximately equal to 3.14159" },
      {
        symbol: "r",
        name: "Radius",
        description: "The distance from the center of the circle to any point on its edge",
      },
    ],
    example: {
      problem: "Find the circumference of a circle with radius 7 cm.",
      solution: "C = 43.98 cm",
      steps: ["C = 2πr", "C = 2 × π × 7 cm", "C = 14π cm", "C ≈ 14 × 3.14159 cm", "C ≈ 43.98 cm"],
    },
  },
  {
    id: "area-of-triangle",
    title: "Area of a Triangle",
    formula: "A = (1/2) × b × h",
    description: "The area of a triangle is calculated as half the product of its base and height.",
    category: "geometry",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "A", name: "Area", description: "The total space inside the triangle" },
      { symbol: "b", name: "Base", description: "The length of one side of the triangle" },
      { symbol: "h", name: "Height", description: "The perpendicular distance from the base to the opposite vertex" },
    ],
    example: {
      problem: "Find the area of a triangle with base 8 cm and height 6 cm.",
      solution: "A = 24 cm²",
      steps: ["A = (1/2) × b × h", "A = (1/2) × 8 cm × 6 cm", "A = (1/2) × 48 cm²", "A = 24 cm²"],
    },
  },

  // Statistics & Probability Formulas
  {
    id: "average",
    title: "Average (Mean)",
    formula: "x̄ = (x₁ + x₂ + ... + xₙ) / n",
    description:
      "The average (arithmetic mean) is calculated by summing all values and dividing by the number of values.",
    category: "statistics",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "x̄", name: "Mean", description: "The average value" },
      { symbol: "x₁, x₂, ..., xₙ", name: "Data values", description: "The individual values in the dataset" },
      { symbol: "n", name: "Count", description: "The number of values in the dataset" },
    ],
    example: {
      problem: "Find the average of the numbers 12, 15, 18, 21, and 24.",
      solution: "x̄ = 18",
      steps: ["x̄ = (x₁ + x₂ + ... + xₙ) / n", "x̄ = (12 + 15 + 18 + 21 + 24) / 5", "x̄ = 90 / 5", "x̄ = 18"],
    },
  },
  {
    id: "probability",
    title: "Probability",
    formula: "P(E) = n(E) / n(S)",
    description:
      "The probability of an event is the number of favorable outcomes divided by the total number of possible outcomes.",
    category: "probability",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "P(E)", name: "Probability", description: "The probability of event E occurring" },
      { symbol: "n(E)", name: "Favorable outcomes", description: "The number of ways event E can occur" },
      { symbol: "n(S)", name: "Total outcomes", description: "The total number of possible outcomes" },
    ],
    example: {
      problem: "When rolling a six-sided die, what is the probability of rolling an even number?",
      solution: "P(E) = 1/2 or 0.5",
      steps: [
        "Identify the favorable outcomes: 2, 4, 6 (three even numbers)",
        "Identify the total possible outcomes: 1, 2, 3, 4, 5, 6 (six numbers)",
        "P(E) = n(E) / n(S)",
        "P(E) = 3 / 6",
        "P(E) = 1/2 or 0.5",
      ],
    },
  },

  // Algebra & Coordinate Geometry Formulas
  {
    id: "quadratic-formula",
    title: "Quadratic Formula",
    formula: "x = (-b ± √(b² - 4ac)) / 2a",
    description: "Used to solve quadratic equations of the form ax² + bx + c = 0.",
    category: "algebra",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "a", name: "Coefficient a", description: "The coefficient of the x² term" },
      { symbol: "b", name: "Coefficient b", description: "The coefficient of the x term" },
      { symbol: "c", name: "Constant c", description: "The constant term" },
      { symbol: "x", name: "Solution", description: "The value(s) of x that satisfy the equation" },
    ],
    example: {
      problem: "Solve the quadratic equation 2x² + 5x - 3 = 0",
      solution: "x = 0.5, x = -3",
      steps: [
        "Identify a = 2, b = 5, c = -3",
        "Apply the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
        "x = (-5 ± √(5² - 4*2*(-3))) / (2*2)",
        "x = (-5 ± √(25 + 24)) / 4",
        "x = (-5 ± √49) / 4",
        "x = (-5 + 7) / 4 = 2/4 = 0.5",
        "x = (-5 - 7) / 4 = -12/4 = -3",
      ],
    },
  },
  {
    id: "distance-formula",
    title: "Distance Formula",
    formula: "d = √((x₂ - x₁)² + (y₂ - y₁)²)",
    description: "The distance formula calculates the straight-line distance between two points in a coordinate plane.",
    category: "algebra",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "d", name: "Distance", description: "The straight-line distance between two points" },
      { symbol: "(x₁, y₁)", name: "First point", description: "The coordinates of the first point" },
      { symbol: "(x₂, y₂)", name: "Second point", description: "The coordinates of the second point" },
    ],
    example: {
      problem: "Find the distance between the points (2, 3) and (5, 7).",
      solution: "d = 5",
      steps: [
        "d = √((x₂ - x₁)² + (y₂ - y₁)²)",
        "d = √((5 - 2)² + (7 - 3)²)",
        "d = √(3² + 4²)",
        "d = √(9 + 16)",
        "d = √25",
        "d = 5",
      ],
    },
  },
  {
    id: "slope-formula",
    title: "Slope Formula",
    formula: "m = (y₂ - y₁) / (x₂ - x₁)",
    description: "Calculates the steepness of a line by finding the ratio of vertical change to horizontal change.",
    category: "algebra",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "m", name: "Slope", description: "The steepness of the line" },
      { symbol: "(x₁, y₁)", name: "First point", description: "The coordinates of the first point" },
      { symbol: "(x₂, y₂)", name: "Second point", description: "The coordinates of the second point" },
    ],
    example: {
      problem: "Find the slope of a line that passes through the points (2, 3) and (6, 8).",
      solution: "m = 1.25",
      steps: ["m = (y₂ - y₁) / (x₂ - x₁)", "m = (8 - 3) / (6 - 2)", "m = 5 / 4", "m = 1.25"],
    },
  },
  {
    id: "slope-intercept-form",
    title: "Slope-Intercept Form",
    formula: "y = mx + b",
    description: "The slope-intercept form of a linear equation, where m is the slope and b is the y-intercept.",
    category: "algebra",
    difficulty: "medium",
    points: 10,
    variables: [
      { symbol: "y", name: "y-coordinate", description: "The vertical position on the coordinate plane" },
      { symbol: "m", name: "Slope", description: "The steepness of the line" },
      { symbol: "x", name: "x-coordinate", description: "The horizontal position on the coordinate plane" },
      { symbol: "b", name: "y-intercept", description: "The y-coordinate where the line crosses the y-axis" },
    ],
    example: {
      problem: "Write the equation of a line with slope 3 and y-intercept -2.",
      solution: "y = 3x - 2",
      steps: ["Use the slope-intercept form: y = mx + b", "Substitute m = 3 and b = -2", "y = 3x - 2"],
    },
  },

  // Trigonometry Formulas
  {
    id: "sine-formula",
    title: "Sine (SOH)",
    formula: "sin(θ) = opposite / hypotenuse",
    description:
      "In a right triangle, the sine of an angle is the ratio of the length of the opposite side to the length of the hypotenuse.",
    category: "trigonometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "sin(θ)", name: "Sine", description: "The sine of angle θ" },
      { symbol: "opposite", name: "Opposite side", description: "The side opposite to angle θ" },
      { symbol: "hypotenuse", name: "Hypotenuse", description: "The longest side of the right triangle" },
    ],
    example: {
      problem: "In a right triangle, the hypotenuse is 10 cm and the opposite side to angle θ is 6 cm. Find sin(θ).",
      solution: "sin(θ) = 0.6",
      steps: ["sin(θ) = opposite / hypotenuse", "sin(θ) = 6 cm / 10 cm", "sin(θ) = 0.6"],
    },
  },
  {
    id: "cosine-formula",
    title: "Cosine (CAH)",
    formula: "cos(θ) = adjacent / hypotenuse",
    description:
      "In a right triangle, the cosine of an angle is the ratio of the length of the adjacent side to the length of the hypotenuse.",
    category: "trigonometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "cos(θ)", name: "Cosine", description: "The cosine of angle θ" },
      { symbol: "adjacent", name: "Adjacent side", description: "The side adjacent to angle θ" },
      { symbol: "hypotenuse", name: "Hypotenuse", description: "The longest side of the right triangle" },
    ],
    example: {
      problem: "In a right triangle, the hypotenuse is 8 cm and the adjacent side to angle θ is 4 cm. Find cos(θ).",
      solution: "cos(θ) = 0.5",
      steps: ["cos(θ) = adjacent / hypotenuse", "cos(θ) = 4 cm / 8 cm", "cos(θ) = 0.5"],
    },
  },
  {
    id: "tangent-formula",
    title: "Tangent (TOA)",
    formula: "tan(θ) = opposite / adjacent",
    description:
      "In a right triangle, the tangent of an angle is the ratio of the length of the opposite side to the length of the adjacent side.",
    category: "trigonometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "tan(θ)", name: "Tangent", description: "The tangent of angle θ" },
      { symbol: "opposite", name: "Opposite side", description: "The side opposite to angle θ" },
      { symbol: "adjacent", name: "Adjacent side", description: "The side adjacent to angle θ" },
    ],
    example: {
      problem: "In a right triangle, the opposite side to angle θ is 9 cm and the adjacent side is 12 cm. Find tan(θ).",
      solution: "tan(θ) = 0.75",
      steps: ["tan(θ) = opposite / adjacent", "tan(θ) = 9 cm / 12 cm", "tan(θ) = 0.75"],
    },
  },
  {
    id: "law-of-sines",
    title: "Law of Sines",
    formula: "sin(A)/a = sin(B)/b = sin(C)/c",
    description:
      "The Law of Sines relates the sides of a triangle to the sines of the opposite angles, useful for solving triangles when certain sides and angles are known.",
    category: "trigonometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "A, B, C", name: "Angles", description: "The angles of the triangle" },
      { symbol: "a, b, c", name: "Sides", description: "The sides opposite to angles A, B, and C respectively" },
    ],
    example: {
      problem: "In triangle ABC, if a = 8, b = 12, and A = 30°, find angle B.",
      solution: "B ≈ 48.6°",
      steps: [
        "Use the Law of Sines: sin(A)/a = sin(B)/b",
        "Rearrange to solve for sin(B): sin(B) = (b × sin(A))/a",
        "Substitute the values: sin(B) = (12 × sin(30°))/8",
        "Simplify: sin(B) = (12 × 0.5)/8 = 6/8 = 0.75",
        "Calculate B = arcsin(0.75) ≈ 48.6°",
      ],
    },
  },

  // Pythagorean Theorem
  {
    id: "pythagorean-theorem",
    title: "Pythagorean Theorem",
    formula: "a² + b² = c²",
    description: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
    category: "geometry",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "a", name: "Leg a", description: "One of the shorter sides of the right triangle" },
      { symbol: "b", name: "Leg b", description: "The other shorter side of the right triangle" },
      { symbol: "c", name: "Hypotenuse", description: "The longest side, opposite the right angle" },
    ],
    example: {
      problem: "A right triangle has legs of length 3 and 4. What is the length of the hypotenuse?",
      solution: "c = 5",
      steps: ["a² + b² = c²", "3² + 4² = c²", "9 + 16 = c²", "25 = c²", "c = √25 = 5"],
    },
  },

  // Complex Numbers
  {
    id: "complex-number-standard-form",
    title: "Standard Form of a Complex Number",
    formula: "z = a + bi",
    description: "A complex number is represented in standard form as the sum of a real part and an imaginary part.",
    category: "complex-numbers",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "z", name: "Complex number", description: "The complex number" },
      { symbol: "a", name: "Real part", description: "The real part of the complex number" },
      { symbol: "b", name: "Imaginary part", description: "The coefficient of the imaginary unit" },
      { symbol: "i", name: "Imaginary unit", description: "The square root of -1" },
    ],
    example: {
      problem: "Express the complex number with real part 3 and imaginary part -4 in standard form.",
      solution: "z = 3 - 4i",
      steps: ["Use the standard form: z = a + bi", "Substitute a = 3 and b = -4", "z = 3 + (-4)i", "z = 3 - 4i"],
    },
  },
  {
    id: "complex-number-modulus",
    title: "Modulus of a Complex Number",
    formula: "|z| = √(a² + b²)",
    description:
      "The modulus (absolute value) of a complex number is the distance from the origin to the point in the complex plane.",
    category: "complex-numbers",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "|z|", name: "Modulus", description: "The absolute value of the complex number" },
      { symbol: "a", name: "Real part", description: "The real part of the complex number" },
      { symbol: "b", name: "Imaginary part", description: "The coefficient of the imaginary unit" },
    ],
    example: {
      problem: "Find the modulus of the complex number z = 3 + 4i.",
      solution: "|z| = 5",
      steps: ["|z| = √(a² + b²)", "|z| = √(3² + 4²)", "|z| = √(9 + 16)", "|z| = √25", "|z| = 5"],
    },
  },
  {
    id: "complex-number-conjugate",
    title: "Conjugate of a Complex Number",
    formula: "z̄ = a - bi",
    description: "The conjugate of a complex number is obtained by changing the sign of the imaginary part.",
    category: "complex-numbers",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "z̄", name: "Conjugate", description: "The complex conjugate of z" },
      { symbol: "a", name: "Real part", description: "The real part of the complex number" },
      { symbol: "b", name: "Imaginary part", description: "The coefficient of the imaginary unit" },
    ],
    example: {
      problem: "Find the conjugate of the complex number z = 2 - 5i.",
      solution: "z̄ = 2 + 5i",
      steps: [
        "For z = a + bi, the conjugate is z̄ = a - bi",
        "For z = 2 - 5i, we have a = 2 and b = -5",
        "z̄ = 2 - (-5)i",
        "z̄ = 2 + 5i",
      ],
    },
  },

  // 3D Geometry
  {
    id: "volume-of-cube",
    title: "Volume of a Cube",
    formula: "V = a³",
    description: "The volume of a cube is calculated by cubing the length of one edge.",
    category: "3d-geometry",
    difficulty: "easy",
    points: 10,
    variables: [
      { symbol: "V", name: "Volume", description: "The amount of space occupied by the cube" },
      { symbol: "a", name: "Edge length", description: "The length of one edge of the cube" },
    ],
    example: {
      problem: "Find the volume of a cube with edge length 4 cm.",
      solution: "V = 64 cm³",
      steps: ["V = a³", "V = 4³ cm³", "V = 64 cm³"],
    },
  },
  {
    id: "volume-of-cylinder",
    title: "Volume of a Cylinder",
    formula: "V = πr²h",
    description: "The volume of a cylinder is calculated using the radius of the base and the height.",
    category: "3d-geometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "V", name: "Volume", description: "The amount of space occupied by the cylinder" },
      { symbol: "π", name: "Pi", description: "The mathematical constant approximately equal to 3.14159" },
      { symbol: "r", name: "Radius", description: "The radius of the circular base" },
      { symbol: "h", name: "Height", description: "The height of the cylinder" },
    ],
    example: {
      problem: "Find the volume of a cylinder with radius 3 cm and height 8 cm.",
      solution: "V ≈ 226.19 cm³",
      steps: [
        "V = πr²h",
        "V = π × 3² × 8 cm³",
        "V = π × 9 × 8 cm³",
        "V = 72π cm³",
        "V ≈ 72 × 3.14159 cm³",
        "V ≈ 226.19 cm³",
      ],
    },
  },
  {
    id: "surface-area-of-sphere",
    title: "Surface Area of a Sphere",
    formula: "A = 4πr²",
    description: "The surface area of a sphere is calculated using the radius and the mathematical constant π.",
    category: "3d-geometry",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "A", name: "Surface area", description: "The total area of the surface of the sphere" },
      { symbol: "π", name: "Pi", description: "The mathematical constant approximately equal to 3.14159" },
      { symbol: "r", name: "Radius", description: "The radius of the sphere" },
    ],
    example: {
      problem: "Find the surface area of a sphere with radius 5 cm.",
      solution: "A ≈ 314.16 cm²",
      steps: [
        "A = 4πr²",
        "A = 4π × 5² cm²",
        "A = 4π × 25 cm²",
        "A = 100π cm²",
        "A ≈ 100 × 3.14159 cm²",
        "A ≈ 314.16 cm²",
      ],
    },
  },

  // Calculus
  {
    id: "derivative-power-rule",
    title: "Power Rule for Derivatives",
    formula: "d/dx(xⁿ) = n×xⁿ⁻¹",
    description: "Used to find the derivative of a variable raised to a power.",
    category: "calculus",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "x", name: "Variable", description: "The variable being differentiated" },
      { symbol: "n", name: "Power", description: "The exponent to which the variable is raised" },
      { symbol: "d/dx", name: "Derivative", description: "The derivative with respect to x" },
    ],
    example: {
      problem: "Find the derivative of x³.",
      solution: "d/dx(x³) = 3x²",
      steps: ["d/dx(xⁿ) = n×xⁿ⁻¹", "d/dx(x³) = 3 × x^(3-1)", "d/dx(x³) = 3x²"],
    },
  },
  // Additional Calculus Formulas
  {
    id: "derivative-product-rule",
    title: "Product Rule for Derivatives",
    formula: "d/dx[f(x)g(x)] = f(x)·g'(x) + g(x)·f'(x)",
    description: "The product rule is used to find the derivative of a product of two differentiable functions.",
    category: "calculus",
    difficulty: "hard",
    points: 20,
    variables: [
      { symbol: "f(x)", name: "First function", description: "The first differentiable function" },
      { symbol: "g(x)", name: "Second function", description: "The second differentiable function" },
      { symbol: "f'(x)", name: "Derivative of f", description: "The derivative of the first function" },
      { symbol: "g'(x)", name: "Derivative of g", description: "The derivative of the second function" },
    ],
    example: {
      problem: "Find the derivative of y = x²·sin(x).",
      solution: "y' = x²·cos(x) + 2x·sin(x)",
      steps: [
        "Let f(x) = x² and g(x) = sin(x)",
        "Find f'(x) = 2x",
        "Find g'(x) = cos(x)",
        "Apply the product rule: d/dx[f(x)g(x)] = f(x)·g'(x) + g(x)·f'(x)",
        "d/dx[x²·sin(x)] = x²·cos(x) + sin(x)·2x",
        "y' = x²·cos(x) + 2x·sin(x)",
      ],
    },
  },
  {
    id: "derivative-quotient-rule",
    title: "Quotient Rule for Derivatives",
    formula: "d/dx[f(x)/g(x)] = [g(x)·f'(x) - f(x)·g'(x)]/[g(x)]²",
    description: "The quotient rule is used to find the derivative of a quotient of two differentiable functions.",
    category: "calculus",
    difficulty: "hard",
    points: 20,
    variables: [
      { symbol: "f(x)", name: "Numerator function", description: "The function in the numerator" },
      { symbol: "g(x)", name: "Denominator function", description: "The function in the denominator" },
      { symbol: "f'(x)", name: "Derivative of f", description: "The derivative of the numerator function" },
      { symbol: "g'(x)", name: "Derivative of g", description: "The derivative of the denominator function" },
    ],
    example: {
      problem: "Find the derivative of y = sin(x)/x.",
      solution: "y' = [x·cos(x) - sin(x)]/x²",
      steps: [
        "Let f(x) = sin(x) and g(x) = x",
        "Find f'(x) = cos(x)",
        "Find g'(x) = 1",
        "Apply the quotient rule: d/dx[f(x)/g(x)] = [g(x)·f'(x) - f(x)·g'(x)]/[g(x)]²",
        "d/dx[sin(x)/x] = [x·cos(x) - sin(x)·1]/x²",
        "y' = [x·cos(x) - sin(x)]/x²",
      ],
    },
  },
  {
    id: "definite-integral",
    title: "Definite Integral",
    formula: "∫ₐᵇ f(x) dx = F(b) - F(a)",
    description:
      "The definite integral represents the area under a curve between two points, calculated using the Fundamental Theorem of Calculus.",
    category: "calculus",
    difficulty: "hard",
    points: 20,
    variables: [
      { symbol: "∫", name: "Integral", description: "The integral symbol" },
      { symbol: "a", name: "Lower limit", description: "The lower bound of integration" },
      { symbol: "b", name: "Upper limit", description: "The upper bound of integration" },
      { symbol: "f(x)", name: "Integrand", description: "The function being integrated" },
      { symbol: "F(x)", name: "Antiderivative", description: "The antiderivative of f(x)" },
    ],
    example: {
      problem: "Evaluate the definite integral ∫₀² x² dx.",
      solution: "∫₀² x² dx = 8/3",
      steps: [
        "Find the antiderivative: F(x) = x³/3",
        "Apply the Fundamental Theorem: ∫ₐᵇ f(x) dx = F(b) - F(a)",
        "∫₀² x² dx = F(2) - F(0)",
        "∫₀² x² dx = (2³/3) - (0³/3)",
        "∫₀² x² dx = 8/3 - 0",
        "∫₀² x² dx = 8/3",
      ],
    },
  },

  // Statistics Formulas
  {
    id: "standard-deviation",
    title: "Standard Deviation",
    formula: "σ = √[(Σ(xᵢ - μ)²)/n]",
    description: "Standard deviation measures the amount of variation or dispersion in a set of values.",
    category: "statistics",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "σ", name: "Standard deviation", description: "The measure of dispersion in the dataset" },
      { symbol: "xᵢ", name: "Data value", description: "Each individual value in the dataset" },
      { symbol: "μ", name: "Mean", description: "The average of all values in the dataset" },
      { symbol: "n", name: "Count", description: "The number of values in the dataset" },
    ],
    example: {
      problem: "Calculate the standard deviation of the dataset: 4, 8, 6, 2, 5.",
      solution: "σ = 2.24",
      steps: [
        "Calculate the mean: μ = (4 + 8 + 6 + 2 + 5)/5 = 25/5 = 5",
        "Calculate the squared deviations: (4-5)² = 1, (8-5)² = 9, (6-5)² = 1, (2-5)² = 9, (5-5)² = 0",
        "Sum the squared deviations: 1 + 9 + 1 + 9 + 0 = 20",
        "Divide by n: 20/5 = 4",
        "Take the square root: σ = √4 = 2",
      ],
    },
  },
  {
    id: "normal-distribution",
    title: "Normal Distribution Probability Density",
    formula: "f(x) = (1/(σ√(2π))) · e^(-(x-μ)²/(2σ²))",
    description: "The probability density function of the normal distribution, which describes many natural phenomena.",
    category: "statistics",
    difficulty: "hard",
    points: 20,
    variables: [
      { symbol: "f(x)", name: "Probability density", description: "The height of the probability density at point x" },
      { symbol: "μ", name: "Mean", description: "The mean of the distribution" },
      { symbol: "σ", name: "Standard deviation", description: "The standard deviation of the distribution" },
      { symbol: "e", name: "Euler's number", description: "The base of the natural logarithm, approximately 2.71828" },
      { symbol: "π", name: "Pi", description: "The mathematical constant approximately equal to 3.14159" },
    ],
    example: {
      problem: "Calculate the probability density at x = 2 for a normal distribution with μ = 0 and σ = 1.",
      solution: "f(2) ≈ 0.054",
      steps: [
        "Use the formula: f(x) = (1/(σ√(2π))) · e^(-(x-μ)²/(2σ²))",
        "Substitute μ = 0, σ = 1, and x = 2",
        "f(2) = (1/(1·√(2π))) · e^(-(2-0)²/(2·1²))",
        "f(2) = (1/√(2π)) · e^(-4/2)",
        "f(2) = (1/√(2π)) · e^(-2)",
        "f(2) ≈ (1/2.506) · 0.135",
        "f(2) ≈ 0.054",
      ],
    },
  },

  // Financial Mathematics
  {
    id: "compound-interest",
    title: "Compound Interest",
    formula: "A = P(1 + r/n)^(nt)",
    description: "Compound interest calculates the growth of an investment when interest is added to the principal.",
    category: "algebra",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "A", name: "Final amount", description: "The final value of the investment" },
      { symbol: "P", name: "Principal", description: "The initial investment amount" },
      { symbol: "r", name: "Annual interest rate", description: "The annual interest rate (as a decimal)" },
      {
        symbol: "n",
        name: "Compounding frequency",
        description: "The number of times interest is compounded per year",
      },
      { symbol: "t", name: "Time", description: "The time period in years" },
    ],
    example: {
      problem:
        "Calculate the final amount after 3 years if $1000 is invested at 5% annual interest, compounded quarterly.",
      solution: "A = $1,161.18",
      steps: [
        "Identify P = $1000, r = 0.05, n = 4 (quarterly), t = 3 years",
        "Apply the formula: A = P(1 + r/n)^(nt)",
        "A = 1000(1 + 0.05/4)^(4×3)",
        "A = 1000(1 + 0.0125)^12",
        "A = 1000(1.0125)^12",
        "A = 1000 × 1.16118...",
        "A ≈ $1,161.18",
      ],
    },
  },

  // Linear Algebra
  {
    id: "matrix-determinant-2x2",
    title: "Determinant of a 2×2 Matrix",
    formula: "det(A) = |A| = ad - bc",
    description:
      "The determinant of a 2×2 matrix is a scalar value that provides information about the matrix's invertibility and the system of linear equations it represents.",
    category: "algebra",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "det(A)", name: "Determinant", description: "The determinant of matrix A" },
      { symbol: "a", name: "Element a", description: "The element in the first row, first column" },
      { symbol: "b", name: "Element b", description: "The element in the first row, second column" },
      { symbol: "c", name: "Element c", description: "The element in the second row, first column" },
      { symbol: "d", name: "Element d", description: "The element in the second row, second column" },
    ],
    example: {
      problem: "Calculate the determinant of the matrix A = [[3, 4], [2, 1]].",
      solution: "det(A) = -5",
      steps: [
        "Identify a = 3, b = 4, c = 2, d = 1",
        "Apply the formula: det(A) = ad - bc",
        "det(A) = 3×1 - 4×2",
        "det(A) = 3 - 8",
        "det(A) = -5",
      ],
    },
  },

  // Physics Formulas
  {
    id: "kinetic-energy",
    title: "Kinetic Energy",
    formula: "KE = (1/2)mv²",
    description: "Kinetic energy is the energy possessed by an object due to its motion.",
    category: "physics",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "KE", name: "Kinetic energy", description: "The energy of motion, measured in joules (J)" },
      { symbol: "m", name: "Mass", description: "The mass of the object, measured in kilograms (kg)" },
      { symbol: "v", name: "Velocity", description: "The speed of the object, measured in meters per second (m/s)" },
    ],
    example: {
      problem: "Calculate the kinetic energy of a 2 kg object moving at 5 m/s.",
      solution: "KE = 25 J",
      steps: [
        "Identify m = 2 kg and v = 5 m/s",
        "Apply the formula: KE = (1/2)mv²",
        "KE = (1/2) × 2 kg × (5 m/s)²",
        "KE = (1/2) × 2 kg × 25 m²/s²",
        "KE = 25 kg·m²/s² = 25 J",
      ],
    },
  },
  {
    id: "gravitational-potential-energy",
    title: "Gravitational Potential Energy",
    formula: "PE = mgh",
    description:
      "Gravitational potential energy is the energy stored in an object due to its height above a reference point in a gravitational field.",
    category: "physics",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "PE", name: "Potential energy", description: "The energy due to position, measured in joules (J)" },
      { symbol: "m", name: "Mass", description: "The mass of the object, measured in kilograms (kg)" },
      {
        symbol: "g",
        name: "Gravitational acceleration",
        description: "The acceleration due to gravity, approximately 9.8 m/s² on Earth",
      },
      { symbol: "h", name: "Height", description: "The height above the reference point, measured in meters (m)" },
    ],
    example: {
      problem:
        "Calculate the gravitational potential energy of a 5 kg object at a height of 10 meters above the ground.",
      solution: "PE = 490 J",
      steps: [
        "Identify m = 5 kg, g = 9.8 m/s², and h = 10 m",
        "Apply the formula: PE = mgh",
        "PE = 5 kg × 9.8 m/s² × 10 m",
        "PE = 490 kg·m²/s² = 490 J",
      ],
    },
  },

  // Combinatorics
  {
    id: "permutation",
    title: "Permutation",
    formula: "P(n,r) = n!/(n-r)!",
    description:
      "Permutation calculates the number of ways to arrange r objects from a set of n distinct objects, where order matters.",
    category: "probability",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "P(n,r)", name: "Permutation", description: "The number of permutations" },
      { symbol: "n", name: "Total objects", description: "The total number of distinct objects" },
      { symbol: "r", name: "Selected objects", description: "The number of objects to be arranged" },
      { symbol: "n!", name: "Factorial", description: "The product of all positive integers less than or equal to n" },
    ],
    example: {
      problem: "In how many ways can 3 people be selected from 7 people and arranged in a line?",
      solution: "P(7,3) = 210",
      steps: [
        "Apply the formula: P(n,r) = n!/(n-r)!",
        "P(7,3) = 7!/(7-3)!",
        "P(7,3) = 7!/4!",
        "P(7,3) = (7×6×5×4!)/(4!)",
        "P(7,3) = 7×6×5 = 210",
      ],
    },
  },
  {
    id: "combination",
    title: "Combination",
    formula: "C(n,r) = n!/[r!(n-r)!]",
    description:
      "Combination calculates the number of ways to select r objects from a set of n distinct objects, where order doesn't matter.",
    category: "probability",
    difficulty: "medium",
    points: 15,
    variables: [
      { symbol: "C(n,r)", name: "Combination", description: "The number of combinations" },
      { symbol: "n", name: "Total objects", description: "The total number of distinct objects" },
      { symbol: "r", name: "Selected objects", description: "The number of objects to be selected" },
      { symbol: "n!", name: "Factorial", description: "The product of all positive integers less than or equal to n" },
    ],
    example: {
      problem: "In how many ways can a committee of 3 people be formed from a group of 8 people?",
      solution: "C(8,3) = 56",
      steps: [
        "Apply the formula: C(n,r) = n!/[r!(n-r)!]",
        "C(8,3) = 8!/[3!(8-3)!]",
        "C(8,3) = 8!/[3!×5!]",
        "C(8,3) = (8×7×6×5!)/(3!×5!)",
        "C(8,3) = (8×7×6)/(3×2×1)",
        "C(8,3) = 336/6 = 56",
      ],
    },
  },
]

// Export mathFormulas as an alias of formulas for backward compatibility
export const mathFormulas = formulas

// Function to get a formula by ID
export function getFormulaById(id: string): MathFormula | undefined {
  return formulas.find((formula) => formula.id === id)
}

// Function to get the formula of the day based on the current date
export function getFormulaOfTheDay(): MathFormula {
  const today = new Date()
  const index = today.getDate() % formulas.length
  return formulas[index]
}

// Export getDailyFormula as an alias of getFormulaOfTheDay for compatibility
export function getDailyFormula(): MathFormula {
  return getFormulaOfTheDay()
}

// Function to get all formulas
export function getAllFormulas(): MathFormula[] {
  return formulas
}

// Function to get formulas by category
export function getFormulasByCategory(category: FormulaCategory): MathFormula[] {
  return formulas.filter((formula) => formula.category === category)
}

