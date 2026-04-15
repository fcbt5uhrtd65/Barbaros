import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Calendar as CalendarIcon, Users, Package, Settings,
  Search, Bell, ChevronLeft, ChevronRight, LogOut, Download, Plus,
  TrendingUp, DollarSign, Clock, Star, X, Mail, Phone, Minus,
  AlertCircle, Filter, Edit, Trash2, MoreVertical, CheckCircle,
  UserCog, Briefcase, Award, MapPin, CreditCard, FileText, Save, Eye, User,
  Wallet, ArrowUpCircle, ArrowDownCircle, Receipt, Calculator, Percent as PercentIcon
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

interface AdminPanelProps {
  onLogout: () => void;
  clientesDB: any[];
  citasDB: any[];
  inventarioDB: any[];
  setInventarioDB: (data: any[]) => void;
  empleadosDB: any[];
  setEmpleadosDB: (data: any[]) => void;
  transaccionesDB: any[];
  setTransaccionesDB: (data: any[]) => void;
  statsData: any;
  userRole: 'admin' | 'empleado';
}

export default function AdminPanel({
  onLogout,
  clientesDB,
  citasDB,
  inventarioDB,
  setInventarioDB,
  empleadosDB,
  setEmpleadosDB,
  transaccionesDB,
  setTransaccionesDB,
  statsData,
  userRole
}: AdminPanelProps) {
  const [adminView, setAdminView] = useState<'dashboard' | 'clientes' | 'calendario' | 'empleados' | 'inventario' | 'finanzas' | 'configuracion'>(userRole === 'empleado' ? 'calendario' : 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-04-08');
  const [calendarView, setCalendarView] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddCitaModal, setShowAddCitaModal] = useState(false);
  const [showAddEmpleadoModal, setShowAddEmpleadoModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any>(null);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [selectedProducto, setSelectedProducto] = useState<any>(null);

  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'calendario', label: 'Calendario', icon: CalendarIcon, roles: ['admin', 'empleado'] },
    { id: 'clientes', label: 'Clientes', icon: Users, roles: ['admin', 'empleado'] },
    { id: 'empleados', label: 'Empleados', icon: UserCog, roles: ['admin'] },
    { id: 'inventario', label: 'Inventario', icon: Package, roles: ['admin', 'empleado'] },
    { id: 'finanzas', label: 'Finanzas', icon: Wallet, roles: ['admin'] },
    { id: 'configuracion', label: 'Configuración', icon: Settings, roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  // Funciones de exportación
  const exportClientesToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(clientesDB.map(c => ({
      Nombre: c.nombre,
      Email: c.email,
      Teléfono: c.telefono,
      Membresía: c.membresia || 'Ninguna',
      'Última Visita': c.ultimaVisita,
      'Total Visitas': c.totalVisitas,
      'Gasto Total': c.gastTotal
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, `Clientes_BarbarosClub_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportCitasToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(citasDB.map(c => ({
      Cliente: c.cliente,
      Servicio: c.servicio,
      Fecha: c.fecha,
      Hora: c.hora,
      Duración: c.duracion,
      Barbero: c.barbero,
      Estado: c.estado,
      Precio: c.precio
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Citas');
    XLSX.writeFile(wb, `Citas_BarbarosClub_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportInventarioToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(inventarioDB.map(i => ({
      Producto: i.producto,
      Categoría: i.categoria,
      Stock: i.stock,
      'Stock Mínimo': i.minStock,
      Precio: i.precio,
      Proveedor: i.proveedor,
      Estado: i.stock <= i.minStock ? 'BAJO STOCK' : 'Normal'
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');
    XLSX.writeFile(wb, `Inventario_BarbarosClub_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportEmpleadosToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(empleadosDB.map(e => ({
      Nombre: `${e.nombre} ${e.apellido}`,
      Documento: e.documento,
      Email: e.email,
      Teléfono: e.telefono,
      Puesto: e.puesto,
      Salario: e.salario,
      Comisión: `${e.comision}%`,
      'Fecha Contratación': e.fechaContratacion,
      Estado: e.estado,
      Experiencia: e.experiencia,
      'Total Citas': e.totalCitas,
      'Ingresos Generados': e.ingresosGenerados
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Empleados');
    XLSX.writeFile(wb, `Empleados_BarbarosClub_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const updateStock = (id: number, change: number) => {
    setInventarioDB(inventarioDB.map(item =>
      item.id === id ? { ...item, stock: Math.max(0, item.stock + change) } : item
    ));
  };

  const filteredClientes = clientesDB.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm)
  );

  const citasPorFecha = citasDB.filter(c => c.fecha === selectedDate);

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        {/* Logo */}
        <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6">
          {!sidebarCollapsed && (
            <div>
              <div className="font-serif italic font-bold text-xl text-gray-900">
                BÁRBAROS
              </div>
              <div className="text-xs text-gray-500 tracking-widest">CLUB 1888</div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setAdminView(item.id as any)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#C9A84C] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {!sidebarCollapsed && (
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          {!sidebarCollapsed && (
            <div className="px-4 py-3 bg-gradient-to-r from-[#C9A84C]/10 to-transparent rounded-xl border border-[#C9A84C]/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-semibold text-gray-900">
                  {userRole === 'admin' ? 'Administrador' : 'Empleado'}
                </span>
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {userRole === 'admin' ? 'Acceso Total' : 'Acceso Limitado'}
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes, citas, productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C9A84C] rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#7B1E2A] flex items-center justify-center text-white font-semibold text-sm">
                AD
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">Administrador</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD */}
            {adminView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Vista general de tu negocio</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Hoy
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Semana
                    </button>
                    <button className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors">
                      Mes
                    </button>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        +15%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$6.2M</div>
                    <div className="text-sm text-gray-500">Ingresos del mes</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        +8%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{citasDB.length}</div>
                    <div className="text-sm text-gray-500">Citas programadas</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                        +12%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{clientesDB.length}</div>
                    <div className="text-sm text-gray-500">Clientes activos</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-amber-600" />
                      </div>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        +22%
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">$41k</div>
                    <div className="text-sm text-gray-500">Ticket promedio</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Ingresos */}
                  <div key="chart-ingresos" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Ingresos Mensuales</h3>
                    <div style={{ width: '100%', height: 300 }} id="ingresos-chart-container">
                      <ResponsiveContainer>
                        <AreaChart data={statsData.ventasMes} id="area-chart-ingresos">
                          <defs>
                            <linearGradient id="grad-ventas-admin-dash-2024" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="mes" stroke="#6B7280" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Area type="monotone" dataKey="ventas" stroke="#C9A84C" strokeWidth={2} fillOpacity={1} fill="url(#grad-ventas-admin-dash-2024)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div key="chart-servicios" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Servicios Populares</h3>
                    <div style={{ width: '100%', height: 300 }} id="servicios-chart-container">
                      <ResponsiveContainer>
                        <RePieChart id="pie-chart-servicios">
                          <Pie
                            data={statsData.distribucionServicios}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          >
                            {statsData.distribucionServicios.map((entry: any, index: number) => (
                              <Cell key={`pie-cell-${entry.name.replace(/\s+/g, '-')}-idx${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #E5E7EB',
                              borderRadius: '12px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Barberos */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Barberos del Mes</h3>
                  <div className="space-y-4">
                    {statsData.topBarberos.map((barbero: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            'bg-gradient-to-br from-orange-400 to-orange-600'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{barbero.nombre}</div>
                            <div className="text-sm text-gray-500">{barbero.citas} citas completadas</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#C9A84C]">
                            ${(barbero.ingresos / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-500">Ingresos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CALENDARIO */}
            {adminView === 'calendario' && (
              <motion.div
                key="calendario"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
                    <p className="text-gray-500 mt-1">Gestiona tus citas del día</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={exportCitasToExcel}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={() => setShowAddCitaModal(true)}
                      className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Cita
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {citasDB.filter(c => c.estado === 'Confirmada').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Confirmadas</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {citasDB.filter(c => c.estado === 'Pendiente').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Pendientes</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-[#C9A84C]">
                      ${(citasDB.reduce((sum, c) => sum + c.precio, 0) / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Ingresos proyectados</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-500 mt-1">Barberos activos</div>
                  </div>
                </div>

                {/* Calendar View Selector */}
                <div className="flex gap-3">
                  {['dia', 'semana', 'mes'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setCalendarView(view as any)}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
                        calendarView === view
                          ? 'bg-[#C9A84C] text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Calendar Views */}
                {calendarView === 'mes' && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {new Date(selectedDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const date = new Date(selectedDate);
                            date.setMonth(date.getMonth() - 1);
                            setSelectedDate(date.toISOString().split('T')[0]);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          Hoy
                        </button>
                        <button
                          onClick={() => {
                            const date = new Date(selectedDate);
                            date.setMonth(date.getMonth() + 1);
                            setSelectedDate(date.toISOString().split('T')[0]);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      {(() => {
                        const year = new Date(selectedDate).getFullYear();
                        const month = new Date(selectedDate).getMonth();
                        const firstDay = new Date(year, month, 1).getDay();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const days = [];

                        // Empty cells for days before month starts
                        for (let i = 0; i < firstDay; i++) {
                          days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                        }

                        // Days of the month
                        for (let day = 1; day <= daysInMonth; day++) {
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const dayCitas = citasDB.filter(c => c.fecha === dateStr);
                          const isToday = dateStr === new Date().toISOString().split('T')[0];
                          const isSelected = dateStr === selectedDate;

                          days.push(
                            <button
                              key={day}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`aspect-square p-2 rounded-xl transition-all border-2 ${
                                isSelected
                                  ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                                  : isToday
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex flex-col h-full">
                                <span className={`text-sm font-semibold ${
                                  isSelected ? 'text-[#C9A84C]' : isToday ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                  {day}
                                </span>
                                {dayCitas.length > 0 && (
                                  <div className="flex-1 flex flex-col gap-0.5 mt-1 overflow-hidden">
                                    {dayCitas.slice(0, 2).map((cita, idx) => (
                                      <div
                                        key={`${cita.id}-${idx}`}
                                        className={`text-[8px] px-1 py-0.5 rounded truncate ${
                                          cita.estado === 'Confirmada'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                        title={`${cita.hora} - ${cita.cliente}`}
                                      >
                                        {cita.hora}
                                      </div>
                                    ))}
                                    {dayCitas.length > 2 && (
                                      <div className="text-[8px] text-gray-500 font-medium">
                                        +{dayCitas.length - 2}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        }

                        return days;
                      })()}
                    </div>
                  </div>
                )}

                {/* Day/Week View */}
                {(calendarView === 'dia' || calendarView === 'semana') && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {calendarView === 'dia' ? 'Agenda del Día' : 'Agenda Semanal'}
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const date = new Date(selectedDate);
                            date.setDate(date.getDate() - (calendarView === 'dia' ? 1 : 7));
                            setSelectedDate(date.toISOString().split('T')[0]);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-sm"
                        />
                        <button
                          onClick={() => {
                            const date = new Date(selectedDate);
                            date.setDate(date.getDate() + (calendarView === 'dia' ? 1 : 7));
                            setSelectedDate(date.toISOString().split('T')[0]);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3">
                      {citasPorFecha.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No hay citas programadas para esta fecha</p>
                        </div>
                      ) : (
                        citasPorFecha.map((cita) => (
                          <motion.div
                            key={cita.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-[#C9A84C]"
                          >
                            <div className="text-center min-w-[80px]">
                              <div className="text-2xl font-bold text-gray-900">{cita.hora}</div>
                              <div className="text-xs text-gray-500">{cita.duracion}</div>
                            </div>
                            <div className="h-12 w-px bg-gray-300"></div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{cita.cliente}</div>
                              <div className="text-sm text-gray-600">{cita.servicio}</div>
                              <div className="text-xs text-gray-500 mt-1">Barbero: {cita.barbero}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#C9A84C] mb-1">
                                ${cita.precio.toLocaleString()}
                              </div>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                cita.estado === 'Confirmada'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {cita.estado}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* CLIENTES */}
            {adminView === 'clientes' && (
              <motion.div
                key="clientes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                    <p className="text-gray-500 mt-1">{clientesDB.length} clientes registrados</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={exportClientesToExcel}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={() => setShowAddClientModal(true)}
                      className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Cliente
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">
                      {clientesDB.filter(c => c.membresia === 'Oro').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Membresía Oro</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-400">
                      {clientesDB.filter(c => c.membresia === 'Plata').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Membresía Plata</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-orange-600">
                      {clientesDB.filter(c => c.membresia === 'Bronce').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Membresía Bronce</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {clientesDB.filter(c => !c.membresia).length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Sin Membresía</div>
                  </div>
                </div>

                {/* Clientes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClientes.map((cliente) => (
                    <motion.div
                      key={cliente.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#7B1E2A] flex items-center justify-center text-white font-bold">
                            {cliente.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{cliente.nombre}</h3>
                            {cliente.membresia && (
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                                cliente.membresia === 'Oro'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : cliente.membresia === 'Plata'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}>
                                {cliente.membresia}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {cliente.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {cliente.telefono}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#C9A84C]">{cliente.totalVisitas}</div>
                          <div className="text-[10px] text-gray-500">Visitas</div>
                        </div>
                        <div className="text-center border-x border-gray-100">
                          <div className="text-lg font-bold text-[#C9A84C]">
                            ${(cliente.gastTotal / 1000).toFixed(0)}k
                          </div>
                          <div className="text-[10px] text-gray-500">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-gray-900">
                            {cliente.ultimaVisita.split('-').reverse().join('/')}
                          </div>
                          <div className="text-[10px] text-gray-500">Última</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* INVENTARIO */}
            {adminView === 'inventario' && (
              <motion.div
                key="inventario"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
                    <p className="text-gray-500 mt-1">Gestión de productos y stock</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={exportInventarioToExcel}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProducto(null);
                        setShowAddProductModal(true);
                      }}
                      className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Producto
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{inventarioDB.length}</div>
                    <div className="text-sm text-gray-500 mt-1">Productos totales</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div className="text-2xl font-bold text-red-600">
                        {inventarioDB.filter(i => i.stock <= i.minStock).length}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">Bajo stock</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {inventarioDB.reduce((sum, i) => sum + i.stock, 0)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Unidades totales</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-[#C9A84C]">
                      ${(inventarioDB.reduce((sum, i) => sum + (i.stock * i.precio), 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Valor inventario</div>
                  </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {inventarioDB.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{item.producto}</div>
                              <div className="text-sm text-gray-500">{item.proveedor}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {item.categoria}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className={`text-lg font-bold ${
                                  item.stock <= item.minStock ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                  {item.stock}
                                </div>
                                {item.stock <= item.minStock && (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#C9A84C]">
                              ${item.precio.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                item.stock <= item.minStock
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {item.stock <= item.minStock ? 'Bajo Stock' : 'Normal'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => updateStock(item.id, -1)}
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                  onClick={() => updateStock(item.id, 1)}
                                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-green-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* EMPLEADOS */}
            {adminView === 'empleados' && (
              <motion.div
                key="empleados"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
                    <p className="text-gray-500 mt-1">Gestión del equipo de trabajo</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={exportEmpleadosToExcel}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Exportar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmpleado(null);
                        setShowAddEmpleadoModal(true);
                      }}
                      className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Empleado
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {empleadosDB.filter(e => e.estado === 'Activo').length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Activos</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-[#C9A84C]">
                      {empleadosDB.filter(e => e.puesto.includes('Barbero')).length}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Barberos</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      ${(empleadosDB.reduce((sum, e) => sum + e.salario, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Nómina mensual</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">
                      {empleadosDB.reduce((sum, e) => sum + e.totalCitas, 0)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Citas totales</div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar empleado por nombre, email o puesto..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-sm"
                  />
                </div>

                {/* Empleados Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {empleadosDB
                    .filter(emp =>
                      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      emp.puesto.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((empleado) => (
                      <motion.div
                        key={empleado.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={empleado.foto}
                                alt={empleado.nombre}
                                className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                              />
                              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                                empleado.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {empleado.nombre} {empleado.apellido}
                              </h3>
                              <p className="text-sm text-[#C9A84C] font-medium">{empleado.puesto}</p>
                              {empleado.calificacion && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-medium text-gray-600">
                                    {empleado.calificacion.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedEmpleado(empleado);
                              setShowAddEmpleadoModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 mb-4 text-xs">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {empleado.email}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3 h-3" />
                            {empleado.telefono}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Briefcase className="w-3 h-3" />
                            {empleado.especialidad}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-3 h-3" />
                            {empleado.experiencia} de experiencia
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-lg font-bold text-[#C9A84C]">
                              ${(empleado.salario / 1000).toFixed(0)}k
                            </div>
                            <div className="text-[10px] text-gray-500">Salario</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {empleado.comision}%
                            </div>
                            <div className="text-[10px] text-gray-500">Comisión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {empleado.totalCitas}
                            </div>
                            <div className="text-[10px] text-gray-500">Citas</div>
                          </div>
                        </div>

                        {/* Certificaciones */}
                        {empleado.certificaciones && empleado.certificaciones.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-1 mb-2">
                              <Award className="w-3 h-3 text-[#C9A84C]" />
                              <span className="text-xs font-medium text-gray-600">Certificaciones</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {empleado.certificaciones.map((cert: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] rounded-full"
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* FINANZAS */}
            {adminView === 'finanzas' && (
              <motion.div
                key="finanzas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión Financiera</h1>
                    <p className="text-gray-500 mt-1">Contabilidad e impuestos</p>
                  </div>
                  <button
                    onClick={() => alert('Generar reporte financiero')}
                    className="px-4 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-medium hover:bg-[#B8973D] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar Reporte
                  </button>
                </div>

                {/* KPIs Financieros */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <ArrowUpCircle className="w-8 h-8 text-green-600" />
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">+15%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${(transaccionesDB.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Ingresos Total</div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <ArrowDownCircle className="w-8 h-8 text-red-600" />
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">+8%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${(transaccionesDB.filter(t => t.tipo === 'egreso').reduce((sum, t) => sum + t.monto, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Egresos Total</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${((transaccionesDB.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0) - transaccionesDB.filter(t => t.tipo === 'egreso').reduce((sum, t) => sum + t.monto, 0)) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Utilidad Neta</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <PercentIcon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      ${(transaccionesDB.reduce((sum, t) => sum + (t.iva || 0), 0) / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-600 mt-1">IVA Acumulado</div>
                  </div>
                </div>

                {/* Tabs de Gestión */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {['Transacciones', 'Nómina', 'IVA', 'Balance'].map(tab => (
                      <button
                        key={tab}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#C9A84C] border-b-2 border-transparent hover:border-[#C9A84C] transition-colors"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tabla de Transacciones */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IVA</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transaccionesDB.map(t => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{t.fecha}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                t.tipo === 'ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {t.tipo === 'ingreso' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                                {t.tipo}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{t.categoria}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{t.concepto}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                              ${t.monto.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                              ${(t.iva || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                {t.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-semibold">
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-right text-sm text-gray-900">TOTALES:</td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            ${transaccionesDB.reduce((sum, t) => sum + t.monto, 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">
                            ${transaccionesDB.reduce((sum, t) => sum + (t.iva || 0), 0).toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Nómina */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Nómina Mensual</h3>
                  <div className="space-y-3">
                    {empleadosDB.filter(e => e.estado === 'Activo').map(emp => (
                      <div key={emp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={emp.foto} alt={emp.nombre} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-medium text-gray-900">{emp.nombre} {emp.apellido}</div>
                            <div className="text-sm text-gray-500">{emp.puesto}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${emp.salario.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">+ {emp.comision}% comisión</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-4 bg-[#C9A84C]/10 rounded-xl border-2 border-[#C9A84C]">
                      <div className="font-semibold text-gray-900">TOTAL NÓMINA MENSUAL</div>
                      <div className="font-bold text-xl text-[#C9A84C]">
                        ${empleadosDB.filter(e => e.estado === 'Activo').reduce((sum, e) => sum + e.salario, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CONFIGURACIÓN */}
            {adminView === 'configuracion' && (
              <motion.div
                key="configuracion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
                  <p className="text-gray-500 mt-1">Ajustes del sistema</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Panel de Configuración
                    </h3>
                    <p className="text-gray-500">
                      Próximamente: Ajustes de barbería, horarios, servicios y más
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL: AGREGAR/EDITAR EMPLEADO */}
      <AnimatePresence>
        {showAddEmpleadoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddEmpleadoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#C9A84C]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete la información del empleado
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddEmpleadoModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <form className="space-y-8">
                  {/* Información Personal */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.nombre}
                          placeholder="Juan"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.apellido}
                          placeholder="Pérez"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Documento <span className="text-red-500">*</span>
                        </label>
                        <select
                          defaultValue={selectedEmpleado?.tipoDocumento || 'CC'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        >
                          <option value="CC">Cédula de Ciudadanía</option>
                          <option value="CE">Cédula de Extranjería</option>
                          <option value="PA">Pasaporte</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Documento <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.documento}
                          placeholder="1.234.567.890"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Nacimiento <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          defaultValue={selectedEmpleado?.fechaNacimiento}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          defaultValue={selectedEmpleado?.telefono}
                          placeholder="+57 310 123 4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Contacto y Ubicación</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          defaultValue={selectedEmpleado?.email}
                          placeholder="empleado@barbarosclub.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.direccion}
                          placeholder="Calle 123 #45-67"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.ciudad}
                          placeholder="Bogotá"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Laboral */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Información Laboral</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Puesto <span className="text-red-500">*</span>
                        </label>
                        <select
                          defaultValue={selectedEmpleado?.puesto}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        >
                          <option value="">Seleccione un puesto</option>
                          <option value="Barbero Senior">Barbero Senior</option>
                          <option value="Barbero">Barbero</option>
                          <option value="Barbero Junior">Barbero Junior</option>
                          <option value="Recepcionista">Recepcionista</option>
                          <option value="Administrador">Administrador</option>
                          <option value="Gerente">Gerente</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Especialidad <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.especialidad}
                          placeholder="Cortes Clásicos, Diseño de Barba..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salario Mensual <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue={selectedEmpleado?.salario}
                            placeholder="2500000"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comisión (%) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            defaultValue={selectedEmpleado?.comision}
                            placeholder="12"
                            min="0"
                            max="100"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                            required
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Contratación <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          defaultValue={selectedEmpleado?.fechaContratacion}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experiencia
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.experiencia}
                          placeholder="5 años"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horario de Trabajo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.horario}
                          placeholder="Lunes a Sábado 9:00-18:00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado <span className="text-red-500">*</span>
                        </label>
                        <select
                          defaultValue={selectedEmpleado?.estado || 'Activo'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                          <option value="Vacaciones">Vacaciones</option>
                          <option value="Licencia">Licencia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          URL de Foto
                        </label>
                        <input
                          type="url"
                          defaultValue={selectedEmpleado?.foto}
                          placeholder="https://i.pravatar.cc/150?img=12"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificaciones (separadas por comas)
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedEmpleado?.certificaciones?.join(', ')}
                          placeholder="Barbería Clásica, Diseño de Barba Avanzado"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddEmpleadoModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para guardar
                    alert('Empleado guardado correctamente (funcionalidad en desarrollo)');
                    setShowAddEmpleadoModal(false);
                  }}
                  className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl hover:bg-[#B8973D] transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {selectedEmpleado ? 'Guardar Cambios' : 'Crear Empleado'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: AGREGAR/EDITAR CLIENTE */}
      <AnimatePresence>
        {showAddClientModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddClientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#C9A84C]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Registra los datos del cliente
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddClientModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <form className="space-y-8">
                  {/* Información Personal */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedCliente?.nombre}
                          placeholder="Juan Pérez García"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Documento
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="CC">Cédula</option>
                          <option value="CE">Cédula Extranjería</option>
                          <option value="PA">Pasaporte</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Documento
                        </label>
                        <input
                          type="text"
                          placeholder="1.234.567.890"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Género
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="">Seleccionar</option>
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="O">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Contacto</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          defaultValue={selectedCliente?.telefono}
                          placeholder="+57 310 123 4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={selectedCliente?.email}
                          placeholder="cliente@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          placeholder="Calle 123 #45-67"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferencias */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Preferencias y Membresía</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Membresía
                        </label>
                        <select
                          defaultValue={selectedCliente?.membresia}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        >
                          <option value="">Sin membresía</option>
                          <option value="Bronce">Bronce</option>
                          <option value="Plata">Plata</option>
                          <option value="Oro">Oro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Barbero Preferido
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="">Sin preferencia</option>
                          {empleadosDB.filter(e => e.puesto.includes('Barbero')).map(barbero => (
                            <option key={barbero.id} value={barbero.id}>
                              {barbero.nombre} {barbero.apellido}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ¿Cómo nos conoció?
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="">Seleccionar</option>
                          <option value="instagram">Instagram</option>
                          <option value="google">Google</option>
                          <option value="referido">Referido</option>
                          <option value="facebook">Facebook</option>
                          <option value="paso">Pasó por el local</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div className="flex items-center h-full pt-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-[#C9A84C] border-gray-300 rounded focus:ring-[#C9A84C]" />
                          <span className="text-sm text-gray-700">Acepta recibir promociones</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones / Notas
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Alergias, preferencias especiales, historial..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Cliente guardado correctamente (funcionalidad en desarrollo)');
                    setShowAddClientModal(false);
                  }}
                  className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl hover:bg-[#B8973D] transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {selectedCliente ? 'Guardar Cambios' : 'Crear Cliente'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: AGREGAR/EDITAR CITA */}
      <AnimatePresence>
        {showAddCitaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCitaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#C9A84C]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Nueva Cita</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Programa una cita para un cliente
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddCitaModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <form className="space-y-8">
                  {/* Cliente */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Seleccionar Cliente <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        >
                          <option value="">-- Seleccionar cliente --</option>
                          {clientesDB.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nombre} - {cliente.telefono}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCitaModal(false);
                            setShowAddClientModal(true);
                          }}
                          className="text-sm text-[#C9A84C] hover:text-[#B8973D] font-medium flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          ¿Cliente nuevo? Regístralo aquí
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la Cita */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cita</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Servicio <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar servicio</option>
                          <option value="corte">Corte Clásico - 45 min - $35.000</option>
                          <option value="barba">Afeitado Premium - 40 min - $35.000</option>
                          <option value="corte-barba">Corte + Barba - 75 min - $65.000</option>
                          <option value="diseno-barba">Diseño de Barba - 30 min - $25.000</option>
                          <option value="cejas">Cejas - 20 min - $15.000</option>
                          <option value="tratamiento">Tratamiento VIP - 60 min - $80.000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Barbero <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar barbero</option>
                          {empleadosDB.filter(e => e.puesto.includes('Barbero')).map(barbero => (
                            <option key={barbero.id} value={barbero.id}>
                              {barbero.nombre} {barbero.apellido} - {barbero.especialidad}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          defaultValue={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar hora</option>
                          <option value="09:00">09:00 AM</option>
                          <option value="09:30">09:30 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="10:30">10:30 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="11:30">11:30 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="12:30">12:30 PM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="14:30">02:30 PM</option>
                          <option value="15:00">03:00 PM</option>
                          <option value="15:30">03:30 PM</option>
                          <option value="16:00">04:00 PM</option>
                          <option value="16:30">04:30 PM</option>
                          <option value="17:00">05:00 PM</option>
                          <option value="17:30">05:30 PM</option>
                          <option value="18:00">06:00 PM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmada">Confirmada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Método de Pago
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="">Por definir</option>
                          <option value="efectivo">Efectivo</option>
                          <option value="tarjeta">Tarjeta</option>
                          <option value="transferencia">Transferencia</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notas Especiales
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Instrucciones especiales, recordatorios..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent resize-none"
                        ></textarea>
                      </div>
                      <div className="md:col-span-2 flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C9A84C] border-gray-300 rounded focus:ring-[#C9A84C]" />
                          <span className="text-sm text-gray-700">Enviar recordatorio por WhatsApp</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-[#C9A84C] border-gray-300 rounded focus:ring-[#C9A84C]" />
                          <span className="text-sm text-gray-700">Enviar recordatorio por Email</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddCitaModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Cita creada correctamente (funcionalidad en desarrollo)');
                    setShowAddCitaModal(false);
                  }}
                  className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl hover:bg-[#B8973D] transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Crear Cita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: AGREGAR/EDITAR PRODUCTO */}
      <AnimatePresence>
        {showAddProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-[#C9A84C]/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProducto ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Registra un nuevo producto en el inventario
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <form className="space-y-8">
                  {/* Información Básica */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Información del Producto</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Producto <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedProducto?.producto}
                          placeholder="Aceite de Barba Premium"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría <span className="text-red-500">*</span>
                        </label>
                        <select
                          defaultValue={selectedProducto?.categoria}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          <option value="Barba">Barba</option>
                          <option value="Cabello">Cabello</option>
                          <option value="Piel">Piel</option>
                          <option value="Sets">Sets / Kits</option>
                          <option value="Herramientas">Herramientas</option>
                          <option value="Accesorios">Accesorios</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marca / Proveedor <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedProducto?.proveedor}
                          placeholder="Bárbaros Supply"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU / Código de Barras
                        </label>
                        <input
                          type="text"
                          placeholder="BAR-001-2024"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ubicación en Tienda
                        </label>
                        <input
                          type="text"
                          placeholder="Estante A - Nivel 2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Descripción detallada del producto, ingredientes, beneficios..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Precios y Costos */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Precios y Costos</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio de Compra
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            placeholder="50000"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio de Venta <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue={selectedProducto?.precio}
                            placeholder="85000"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Margen de Ganancia
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="40"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent bg-gray-50"
                            disabled
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inventario */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Control de Inventario</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Inicial <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProducto?.stock}
                          placeholder="45"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Mínimo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProducto?.minStock}
                          placeholder="10"
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Alerta cuando llegue a este nivel</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unidad de Medida
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="unidad">Unidad</option>
                          <option value="ml">Mililitros (ml)</option>
                          <option value="gr">Gramos (gr)</option>
                          <option value="oz">Onzas (oz)</option>
                          <option value="kg">Kilogramos (kg)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Vencimiento
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent">
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="agotado">Agotado</option>
                          <option value="descontinuado">Descontinuado</option>
                        </select>
                      </div>
                      <div className="flex items-center h-full pt-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-[#C9A84C] border-gray-300 rounded focus:ring-[#C9A84C]" />
                          <span className="text-sm text-gray-700">Producto destacado</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Imagen */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="text-lg font-semibold text-gray-900">Imagen del Producto</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de la Imagen
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">O arrastra una imagen aquí (próximamente)</p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('Producto guardado correctamente (funcionalidad en desarrollo)');
                    setShowAddProductModal(false);
                  }}
                  className="px-6 py-3 bg-[#C9A84C] text-white rounded-xl hover:bg-[#B8973D] transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {selectedProducto ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
