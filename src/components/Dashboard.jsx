import { useState, useEffect } from 'react'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Bell, LogOut, Grid, Activity, Thermometer, MessageSquare, Settings, AlertCircle, UserRound } from 'lucide-react'
import worldmap from '../assets/worldmap.png'
import covid from '../assets/covid.jpg'
export default function Dashboard() {
  const [indiaData, setIndiaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.rootnet.in/covid19-in/stats/latest')
        const data = await response.json()
        setIndiaData(data)
        setLoading(false)
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>
  if (!indiaData || !indiaData.data) return <div className="flex justify-center items-center h-screen">No data available</div>

  const { summary, regional } = indiaData.data

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num)

  const topStates = regional.sort((a, b) => b.totalConfirmed - a.totalConfirmed).slice(0, 10)

  const barData = topStates.map(state => ({
    name: state.loc,
    confirmed: state.totalConfirmed,
    deaths: state.deaths,
    recovered: state.discharged
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-20 rounded-3xl bg-indigo-700 lg:min-h-screen fixed bottom-0 lg:top-0 z-10 flex lg:flex-col items-center justify-between lg:justify-start py-4 lg:py-8 lg:space-y-8 ">
          <div className="text-white lg:mb-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <nav className="flex lg:flex-col items-center space-x-6 lg:space-x-0 lg:space-y-6 text-indigo-300" style={{margin:"auto"}}>
            <button className="p-3 rounded-xl bg-indigo-600 text-white">
              <Grid className="w-6 h-6" />
            </button>
            <button className="p-3 hover:bg-indigo-600 rounded-xl transition-colors">
              <Activity className="w-6 h-6" />
            </button>
            <button className="p-3 hover:bg-indigo-600 rounded-xl transition-colors">
              <Thermometer className="w-6 h-6" />
            </button>
            <button className="p-3 hover:bg-indigo-600 rounded-xl transition-colors">
              <MessageSquare className="w-6 h-6" />
            </button>
          </nav>
          <div className="lg:mt-auto">
            <button className="p-3 hover:bg-indigo-600 rounded-xl transition-colors text-indigo-300">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-20 flex-1 p-4 lg:p-8 mb-20 lg:mb-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-indigo-700">Covid-19 in India</h1>
              <p className="text-gray-500 text-sm">State-level Tracker Dashboard</p>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 w-full lg:w-auto">
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Search states..."
                  className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-gray-600">
                  <Bell className="w-6 h-6" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <LogOut className="w-6 h-6" />
                </button>
                <UserRound color="#6b6b6b" />             
                 </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">{formatNumber(summary.total)}</h3>
                  <p className="text-gray-500">Total Confirmed Case</p>
                </div>
                <span className="text-cyan-500 bg-cyan-50 px-2 py-1 rounded-full text-sm">
                  All India
                </span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={topStates}>
                    <Line type="monotone" dataKey="totalConfirmed" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">{formatNumber(summary.deaths)}</h3>
                  <p className="text-gray-500">Total Deaths....</p>
                </div>
                <span className="text-red-500 bg-red-50 px-2 py-1 rounded-full text-sm">
                  All India
                </span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={topStates}>
                    <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-4xl font-bold text-gray-900">{formatNumber(summary.discharged)}</h3>
                  <p className="text-gray-500">Total Recovered</p>
                </div>
                <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm">
                  All India
                </span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={topStates}>
                    <Line type="monotone" dataKey="discharged" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-1">Covid-19 Statistics by State</h3>
              <p className="text-sm text-gray-500 mb-6">Top 10 states by total confirmed cases</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="confirmed" fill="#06b6d4" />
                    <Bar dataKey="deaths" fill="#ef4444" />
                    <Bar dataKey="recovered" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State Updates */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-1">State Updates <span className="text-sm font-normal text-gray-500">(Total Cases)</span></h3>
              <div className="space-y-4 mt-6">
                {topStates.slice(0, 8).map((state, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className={`w-2 h-2 rounded-full ${state.deaths > 1000 ? 'bg-red-500' : 'bg-cyan-500'}`} />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {formatNumber(state.totalConfirmed)} cases
                      </span> in {state.loc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* India Map Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">India Map <span className="text-sm font-normal text-gray-500">(Total Cases)</span></h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {topStates.slice(0, 7).map((state, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{state.loc}</span>
                      <span className="font-semibold">{formatNumber(state.totalConfirmed)}</span>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <img
                    src={worldmap}
                    alt="India Map"
                    className="w-full h-48 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Prevention Card */}
            <div className="bg-indigo-600 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
            <img
                src={covid}
                alt="Prevention Illustration"
                className=" w-64 h-64 rounded-xl mx-auto"
              />
              <h3 className="text-2xl font-semibold mb-2">Prevention</h3>
              <p className="text-indigo-200 mb-8">Learn about COVID-19<br />prevention measures</p>
              <button className="text-white">
                <span className="sr-only">Learn more about prevention</span>
                →
              </button>
           
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}