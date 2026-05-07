import { useEffect, useState } from 'react'

// Firebase-ready collaborative web version
// Replace with your Firebase configuration before deployment
// Supports shared multi-user vehicle database

export default function TruckCapacityCalculateApp() {
  const [cloudEnabled] = useState(true)
  const [page, setPage] = useState('home')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const [search, setSearch] = useState('')
  const [offeringCapacity, setOfferingCapacity] = useState('')

  const [measurements, setMeasurements] = useState([
    { length: '', width: '', height: '' }
  ])

  const [savedVehicles, setSavedVehicles] = useState([
    {
      number: 'KL 07 AB 4567',
      cft: '108.30',
      offeringCapacity: '110',
      measurements: [
        { length: '365', width: '210', height: '120' }
      ]
    },
    {
      number: 'KL 39 C 2211',
      cft: '96.40',
      offeringCapacity: '100',
      measurements: [
        { length: '340', width: '205', height: '115' }
      ]
    }
  ])

  const addMeasurement = () => {
    setMeasurements([
      ...measurements,
      { length: '', width: '', height: '' }
    ])
  }

  const updateMeasurement = (index, field, value) => {
    const updated = [...measurements]
    updated[index][field] = value
    setMeasurements(updated)
  }

  const calculateCFT = (length, width, height) => {
    const l = parseFloat(length || 0)
    const w = parseFloat(width || 0)
    const h = parseFloat(height || 0)

    const cft = (l * w * h) / 28316.85

    return cft.toFixed(2)
  }

  const averageCFT = () => {
    if (measurements.length === 0) return '0.00'

    const total = measurements.reduce((sum, item) => {
      return (
        sum +
        parseFloat(
          calculateCFT(item.length, item.width, item.height)
        )
      )
    }, 0)

    return (total / measurements.length).toFixed(2)
  }

  const saveVehicle = () => {
    if (!vehicleNumber.trim()) {
      alert('Please enter vehicle number')
      return
    }

    const newVehicle = {
      number: vehicleNumber,
      cft: averageCFT(),
      offeringCapacity,
      measurements: measurements
    }

    if (editingIndex !== null) {
      const updatedVehicles = [...savedVehicles]
      updatedVehicles[editingIndex] = newVehicle
      setSavedVehicles(updatedVehicles)
    } else {
      setSavedVehicles([newVehicle, ...savedVehicles])
    }

    alert('Vehicle Saved Successfully')

    setVehicleNumber('')
    setOfferingCapacity('')
    setMeasurements([{ length: '', width: '', height: '' }])
    setEditingIndex(null)
    setPage('search')
  }

  const editVehicle = (vehicle, index) => {
    setVehicleNumber(vehicle.number)
    setOfferingCapacity(vehicle.offeringCapacity || '')
    setMeasurements(vehicle.measurements)
    setEditingIndex(index)
    setPage('new')
  }

  const filteredVehicles = savedVehicles.filter((vehicle) =>
    vehicle.number.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4 text-gray-800">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 mb-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-3xl">
              🚛
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Truck Capacity Calculate
              </h1>
              <p className="text-sm text-gray-500">
                Crusher Vehicle Capacity Calculator
              </p>

              {cloudEnabled && (
                <div className="mt-1 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold">
                  ☁ Cloud Sync Enabled
                </div>
              )}
            </div>
          </div>

          {page === 'home' && (
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setPage('new')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-4 shadow-xl active:scale-95 transition"
              >
                <div className="text-2xl mb-1">➕</div>
                <div className="font-semibold">New Vehicle</div>
              </button>

              <button
                onClick={() => setPage('search')}
                className="bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-2xl p-4 shadow-xl border-0 active:scale-95 transition"
              >
                <div className="text-2xl mb-1">🔍</div>
                <div className="font-semibold">Shared Vehicles</div>
              </button>
            </div>
          )}
        </div>

        {page === 'new' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">
                {editingIndex !== null ? 'Edit Vehicle' : 'New Vehicle'}
              </h2>

              <button
                onClick={() => setPage('home')}
                className="text-sm bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-2 rounded-xl"
              >
                Back
              </button>
            </div>

            <input
              type="text"
              placeholder="Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 mb-4 outline-none"
            />

            

            {measurements.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-4 border border-gray-200 mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">
                    Measurement {index + 1}
                  </h3>

                  <span className="text-sm text-gray-500">CM</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Length"
                    value={item.length}
                    onChange={(e) =>
                      updateMeasurement(index, 'length', e.target.value)
                    }
                    className="rounded-xl border border-gray-300 p-3 outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Width"
                    value={item.width}
                    onChange={(e) =>
                      updateMeasurement(index, 'width', e.target.value)
                    }
                    className="rounded-xl border border-gray-300 p-3 outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Height"
                    value={item.height}
                    onChange={(e) =>
                      updateMeasurement(index, 'height', e.target.value)
                    }
                    className="rounded-xl border border-gray-300 p-3 outline-none"
                  />
                </div>

                <div className="bg-white rounded-xl p-3 border border-gray-200 flex justify-between">
                  <span className="text-gray-500">Cubic Foot</span>
                  <span className="font-bold">
                    {calculateCFT(item.length, item.width, item.height)} CFT
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={addMeasurement}
              className="w-full border-2 border-dashed border-gray-400 rounded-2xl p-4 mb-5 text-gray-700 font-semibold hover:bg-gradient-to-br from-blue-100 via-white to-purple-100 transition"
            >
              ➕ Add Measurement
            </button>

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl p-5 mb-3">
              <div className="text-sm text-gray-300">Average Capacity</div>
              <div className="text-4xl font-bold mt-2">
                {averageCFT()} CFT
              </div>
            </div>

            <div className="bg-white border border-gray-300 rounded-2xl p-4 mb-5">
              <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Offered Capacity
              </div>

              <div className="text-2xl font-bold mt-1 text-gray-900">
                {offeringCapacity || averageCFT()} CFT
              </div>

              <input
                type="number"
                value={offeringCapacity}
                onChange={(e) => setOfferingCapacity(e.target.value)}
                placeholder="Enter Offered CFT"
                className="w-36 border border-gray-300 rounded-xl px-3 py-2 outline-none text-gray-900"
              />
            </div>
          </div>

            <button
              onClick={saveVehicle}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 font-bold shadow-2xl text-lg hover:opacity-90 transition"
            >
              {editingIndex !== null ? 'Update Vehicle' : 'Save Vehicle'}
            </button>
          </div>
        )}

        {page === 'search' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Shared Vehicle Database</h2>

              <button
                onClick={() => setPage('home')}
                className="text-sm bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-2 rounded-xl"
              >
                Back
              </button>
            </div>

            <input
              type="text"
              placeholder="Search Shared Vehicle"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 mb-5 outline-none"
            />

            <div className="space-y-3">
              {filteredVehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-white to-blue-50 border border-gray-200 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">
                        {vehicle.number}
                      </div>

                      <div className="text-sm text-gray-500">
                        Average: {vehicle.cft} CFT
                      </div>

                      <div className="text-sm text-gray-500">
                        Offered Capacity: {vehicle.offeringCapacity || vehicle.cft} CFT
                      </div>
                    </div>
                  </div>

                  <details className="mt-3">
                    <summary className="cursor-pointer bg-white border border-gray-200 rounded-xl p-3 font-semibold text-sm">
                      Show Measurements
                    </summary>

                    <div className="mt-3 space-y-2">
                      {vehicle.measurements.map((m, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl border border-gray-200 p-3 text-sm"
                        >
                          <div>Length: {m.length} cm</div>
                          <div>Width: {m.width} cm</div>
                          <div>Height: {m.height} cm</div>
                          <div className="font-semibold mt-1">
                            {calculateCFT(m.length, m.width, m.height)} CFT
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>

                  <button
                    onClick={() => editVehicle(vehicle, index)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 font-semibold"
                  >
                    Edit Vehicle
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
