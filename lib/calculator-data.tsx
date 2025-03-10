import type React from "react"
import {
  Calculator,
  DollarSign,
  Scale,
  Clock,
  Ruler,
  Percent,
  Calendar,
  CreditCard,
  Thermometer,
  Briefcase,
  Share2,
  TrendingUp,
  Bitcoin,
  LineChart,
  Home,
} from "lucide-react"

// Add these imports at the top of the file if they don't exist
import { InfluencerROI } from "@/components/calculators/influencer/influencer-roi"
import { AudienceOverlap } from "@/components/calculators/influencer/audience-overlap"
import { CampaignBudget } from "@/components/calculators/influencer/campaign-budget"
import { ConversionRate } from "@/components/calculators/influencer/conversion-rate"
import TimeZoneCalculator from "@/components/calculators/time/time-zone"
import DateDifferenceCalculator from "@/components/calculators/time/date-difference"
import CountdownCalculator from "@/components/calculators/time/countdown"
import StopwatchCalculator from "@/components/calculators/time/stopwatch"
import LengthCalculator from "@/components/calculators/measurement/length"
import WeightCalculator from "@/components/calculators/measurement/weight"
import VolumeCalculator from "@/components/calculators/measurement/volume"
import TemperatureCalculator from "@/components/calculators/measurement/temperature"
import AgeCalculator from "@/components/calculators/date/age"
import DaysBetweenCalculator from "@/components/calculators/date/days-between"
import WorkingDaysCalculator from "@/components/calculators/date/working-days"
import AddSubtractDaysCalculator from "@/components/calculators/date/add-subtract-days"
import CryptoConverterCalculator from "@/components/calculators/crypto/crypto-converter"
import CryptoTaxCalculator from "@/components/calculators/crypto/crypto-tax"
import CryptoMiningCalculator from "@/components/calculators/crypto/crypto-mining"
import CryptoBurnMarketCapCalculator from "@/components/calculators/crypto/crypto-burn-marketcap"
import EnergyCalculator from "@/components/calculators/physics/energy"
import ForceCalculator from "@/components/calculators/physics/force"
import VelocityCalculator from "@/components/calculators/physics/velocity"
import PressureCalculator from "@/components/calculators/physics/pressure"
import ExchangeRateCalculator from "@/components/calculators/currency/exchange-rate"
import CurrencyConverterCalculator from "@/components/calculators/currency/currency-converter"
import HistoricalRatesCalculator from "@/components/calculators/currency/historical-rates"

// Add these imports at the top of the file with the other calculator imports
import DiscountCalculator from "@/components/calculators/percentage/discount"
import IncreaseDecreaseCalculator from "@/components/calculators/percentage/increase-decrease"
import TipCalculator from "@/components/calculators/percentage/tip"
import TaxCalculator from "@/components/calculators/percentage/tax"
import RentalYieldCalculator from "@/components/calculators/real-estate/rental-yield"
import CapRateCalculator from "@/components/calculators/real-estate/cap-rate"
import StockReturnCalculator from "@/components/calculators/financial-markets/stock-return"
import PortfolioAllocationCalculator from "@/components/calculators/financial-markets/portfolio-allocation"
import DividendYieldCalculator from "@/components/calculators/financial-markets/dividend-yield"
import OptionsPricingCalculator from "@/components/calculators/financial-markets/options-pricing"
import NetOperatingIncomeCalculator from "@/components/calculators/real-estate/net-operating-income"
import RetirementWithdrawalCalculator from "@/components/calculators/finance/retirement-withdrawal"

export type CalculatorType = {
  name: string
  slug: string
  description: string
  component?: React.ReactNode
}

export type CategoryType = {
  title: string
  slug: string
  description: string
  icon: React.ReactNode
  calculators: CalculatorType[]
}

export const categories: CategoryType[] = [
  {
    title: "Math",
    slug: "math",
    description: "Basic and advanced mathematical calculators",
    icon: <Calculator className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Basic",
        slug: "basic",
        description: "Perform simple arithmetic operations",
      },
      {
        name: "Scientific",
        slug: "scientific",
        description: "Advanced mathematical functions and operations",
      },
      {
        name: "Graphing",
        slug: "graphing",
        description: "Plot and analyze mathematical functions",
      },
      {
        name: "Matrix",
        slug: "matrix",
        description: "Perform operations on matrices",
      },
    ],
  },
  {
    title: "Finance",
    slug: "finance",
    description: "Financial planning and calculation tools",
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Mortgage",
        slug: "mortgage",
        description: "Calculate mortgage payments and amortization schedules",
      },
      {
        name: "Investment",
        slug: "investment",
        description: "Calculate investment growth and returns",
      },
      {
        name: "Loan",
        slug: "loan",
        description: "Calculate loan payments and interest",
      },
      {
        name: "Tax",
        slug: "tax",
        description: "Estimate income tax and deductions",
      },
      {
        name: "Retirement Withdrawal",
        slug: "retirement-withdrawal",
        description: "Calculate how long your retirement savings will last",
        component: <RetirementWithdrawalCalculator />,
      },
    ],
  },
  {
    title: "Financial Markets",
    slug: "financial-markets",
    description: "Stock market and investment analysis tools",
    icon: <LineChart className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Stock Return",
        slug: "stock-return",
        description: "Calculate stock returns including dividends and capital gains",
        component: <StockReturnCalculator />,
      },
      {
        name: "Portfolio Allocation",
        slug: "portfolio-allocation",
        description: "Optimize asset allocation based on risk tolerance",
        component: <PortfolioAllocationCalculator />,
      },
      {
        name: "Dividend Yield",
        slug: "dividend-yield",
        description: "Calculate dividend yield and income projections",
        component: <DividendYieldCalculator />,
      },
      {
        name: "Options Pricing",
        slug: "options-pricing",
        description: "Calculate option prices using Black-Scholes model",
        component: <OptionsPricingCalculator />,
      },
    ],
  },
  {
    title: "Real Estate",
    slug: "real-estate",
    description: "Property investment and analysis calculators",
    icon: <Home className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Rental Yield",
        slug: "rental-yield",
        description: "Calculate gross and net rental yields for property investments",
        component: <RentalYieldCalculator />,
      },
      {
        name: "Capitalization Rate",
        slug: "cap-rate",
        description: "Calculate the capitalization rate for commercial real estate investments",
        component: <CapRateCalculator />,
      },
      {
        name: "Property ROI",
        slug: "property-roi",
        description: "Calculate return on investment for real estate properties",
      },
      {
        name: "Net Operating Income",
        slug: "net-operating-income",
        description: "Calculate the profitability of income-generating real estate properties",
        component: <NetOperatingIncomeCalculator />,
      },
    ],
  },
  {
    title: "Health",
    slug: "health",
    description: "Health and fitness related calculators",
    icon: <Scale className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "BMI",
        slug: "bmi",
        description: "Calculate Body Mass Index based on height and weight",
      },
      {
        name: "Calorie",
        slug: "calorie",
        description: "Calculate daily calorie needs based on activity level",
      },
      {
        name: "Body Fat",
        slug: "body-fat",
        description: "Estimate body fat percentage",
      },
      {
        name: "Heart Rate",
        slug: "heart-rate",
        description: "Calculate target heart rate zones for exercise",
      },
    ],
  },
  {
    title: "Business",
    slug: "business",
    description: "Business and financial analysis tools",
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "ROI",
        slug: "roi",
        description: "Calculate return on investment for business projects",
      },
      {
        name: "Break-Even",
        slug: "break-even",
        description: "Determine when a business will become profitable",
      },
      {
        name: "Profit Margin",
        slug: "profit-margin",
        description: "Calculate gross, operating, and net profit margins",
      },
      {
        name: "Depreciation",
        slug: "depreciation",
        description: "Calculate asset depreciation over time",
      },
      {
        name: "LTV/CLV",
        slug: "ltv",
        description: "Calculate Customer Lifetime Value for business growth",
      },
    ],
  },
  {
    title: "Social Media",
    slug: "social-media",
    description: "Social media metrics and analytics calculators",
    icon: <Share2 className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Engagement Rate",
        slug: "engagement-rate",
        description: "Calculate social media engagement rates",
      },
      {
        name: "Reach Estimator",
        slug: "reach-estimator",
        description: "Estimate potential reach of social media posts",
      },
      {
        name: "Hashtag Analytics",
        slug: "hashtag-analytics",
        description: "Analyze hashtag performance and reach",
      },
      {
        name: "Follower Growth Rate",
        slug: "follower-growth-rate",
        description: "Calculate and project social media follower growth",
      },
    ],
  },
  {
    title: "Influencer Marketing",
    slug: "influencer",
    description: "Tools for influencer campaign planning and analysis",
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Influencer ROI",
        slug: "influencer-roi",
        description: "Calculate the return on investment for influencer campaigns",
        component: <InfluencerROI />,
      },
      {
        name: "Audience Overlap",
        slug: "audience-overlap",
        description: "Estimate unique reach when using multiple influencers",
        component: <AudienceOverlap />,
      },
      {
        name: "Campaign Budget",
        slug: "campaign-budget",
        description: "Allocate your influencer marketing budget effectively",
        component: <CampaignBudget />,
      },
      {
        name: "Conversion Rate",
        slug: "conversion-rate",
        description: "Track conversion metrics throughout the marketing funnel",
        component: <ConversionRate />,
      },
    ],
  },
  {
    title: "Time",
    slug: "time",
    description: "Time calculation and conversion tools",
    icon: <Clock className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Time Zone",
        slug: "time-zone",
        description: "Convert times between different time zones",
        component: <TimeZoneCalculator />,
      },
      {
        name: "Date Difference",
        slug: "date-difference",
        description: "Calculate the difference between two dates",
        component: <DateDifferenceCalculator />,
      },
      {
        name: "Countdown",
        slug: "countdown",
        description: "Create a countdown to a specific date and time",
        component: <CountdownCalculator />,
      },
      {
        name: "Stopwatch",
        slug: "stopwatch",
        description: "Track elapsed time with start, pause, and reset functions",
        component: <StopwatchCalculator />,
      },
    ],
  },
  {
    title: "Measurement",
    slug: "measurement",
    description: "Unit conversion and measurement tools",
    icon: <Ruler className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Length",
        slug: "length",
        description: "Convert between different units of length",
        component: <LengthCalculator />,
      },
      {
        name: "Weight",
        slug: "weight",
        description: "Convert between different units of weight",
        component: <WeightCalculator />,
      },
      {
        name: "Volume",
        slug: "volume",
        description: "Convert between different units of volume",
        component: <VolumeCalculator />,
      },
      {
        name: "Temperature",
        slug: "temperature",
        description: "Convert between different temperature scales",
        component: <TemperatureCalculator />,
      },
    ],
  },
  {
    title: "Percentage",
    slug: "percentage",
    description: "Percentage calculation tools",
    icon: <Percent className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Discount",
        slug: "discount",
        description: "Calculate discounted prices and savings",
        component: <DiscountCalculator />,
      },
      {
        name: "Increase/Decrease",
        slug: "increase-decrease",
        description: "Calculate percentage increases and decreases",
        component: <IncreaseDecreaseCalculator />,
      },
      {
        name: "Tip",
        slug: "tip",
        description: "Calculate tips and split bills",
        component: <TipCalculator />,
      },
      {
        name: "Tax",
        slug: "tax",
        description: "Calculate tax amounts and totals",
        component: <TaxCalculator />,
      },
    ],
  },
  {
    title: "Date",
    slug: "date",
    description: "Date calculation and planning tools",
    icon: <Calendar className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Age",
        slug: "age",
        description: "Calculate age based on birth date",
        component: <AgeCalculator />,
      },
      {
        name: "Days Between",
        slug: "days-between",
        description: "Calculate the number of days between two dates",
        component: <DaysBetweenCalculator />,
      },
      {
        name: "Working Days",
        slug: "working-days",
        description: "Calculate working days between dates, excluding weekends and holidays",
        component: <WorkingDaysCalculator />,
      },
      {
        name: "Date Add/Subtract",
        slug: "date-add-subtract",
        description: "Add or subtract days, months, or years from a date",
        component: <AddSubtractDaysCalculator />,
      },
    ],
  },
  {
    title: "Currency",
    slug: "currency",
    description: "Currency conversion and calculation tools",
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Exchange Rate",
        slug: "exchange-rate",
        description: "Convert between different currencies using current exchange rates",
        component: <ExchangeRateCalculator />,
      },
      {
        name: "Currency Converter",
        slug: "currency-converter",
        description: "Convert amounts between multiple currencies",
        component: <CurrencyConverterCalculator />,
      },
      {
        name: "Historical Rates",
        slug: "historical-rates",
        description: "View and compare historical currency exchange rates",
        component: <HistoricalRatesCalculator />,
      },
    ],
  },
  {
    title: "Cryptocurrency",
    slug: "crypto",
    description: "Cryptocurrency calculation and analysis tools",
    icon: <Bitcoin className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Crypto Converter",
        slug: "crypto-converter",
        description: "Convert between cryptocurrencies and fiat currencies",
        component: <CryptoConverterCalculator />,
      },
      {
        name: "Crypto Tax",
        slug: "crypto-tax",
        description: "Calculate tax implications for cryptocurrency transactions",
        component: <CryptoTaxCalculator />,
      },
      {
        name: "Crypto Mining",
        slug: "crypto-mining",
        description: "Calculate mining profitability for different cryptocurrencies",
        component: <CryptoMiningCalculator />,
      },
      {
        name: "Crypto Burn MarketCap",
        slug: "crypto-burn-marketcap",
        description: "Calculate the impact of token burns on market capitalization",
        component: <CryptoBurnMarketCapCalculator />,
      },
    ],
  },
  {
    title: "Physics",
    slug: "physics",
    description: "Physics calculation and conversion tools",
    icon: <Thermometer className="h-8 w-8 text-primary" />,
    calculators: [
      {
        name: "Energy",
        slug: "energy",
        description: "Calculate and convert between different energy units",
        component: <EnergyCalculator />,
      },
      {
        name: "Force",
        slug: "force",
        description: "Calculate force using mass and acceleration",
        component: <ForceCalculator />,
      },
      {
        name: "Velocity",
        slug: "velocity",
        description: "Calculate velocity, distance, and time",
        component: <VelocityCalculator />,
      },
      {
        name: "Pressure",
        slug: "pressure",
        description: "Calculate and convert between different pressure units",
        component: <PressureCalculator />,
      },
    ],
  },
]

export function getCategoryData(slug: string): CategoryType | undefined {
  return categories.find((category) => category.slug === slug)
}

export function getCalculatorData(categorySlug: string, calculatorSlug: string): CalculatorType | undefined {
  const category = getCategoryData(categorySlug)
  if (!category) return undefined

  return category.calculators.find((calculator) => calculator.slug === calculatorSlug)
}

