import { useState, useEffect } from "react";
import Header from "./components/Header";
import Filtros from "./components/Filtros";
import ListadoGastos from "./components/ListadoGastos";
import Modal from "./components/Modal";
import { generarId } from "./helpers";
import IconoNuevoGasto from "./img/nuevo-gasto.svg";

function App() {
    const [gastos, setGastos] = useState(
        localStorage.getItem("gastos")
            ? JSON.parse(localStorage.getItem("gastos"))
            : []
    );

    const [presupuesto, setPresupuesto] = useState(
        Number(localStorage.getItem("presupuesto")) ?? 0
    );
    const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

    const [modal, setModal] = useState(false);
    const [animarModal, setAnimarModal] = useState(false);

    const [gastoEditar, setGastoEditar] = useState({});

    const [filtro, setFiltro] = useState('')
    const [gastosFiltrados, setGastosFiltrados] = useState([])

    useEffect(() => {
        if (Object.keys(gastoEditar).length > 0) {
            //console.log("Gasto editar tiene algo");
            setModal(true);

            setTimeout(() => {
                setAnimarModal(true);
            }, 300);
        }
    }, [gastoEditar]);

    // Se ejecuta cuando cambia presupuesto
    useEffect(() => {
        localStorage.setItem("presupuesto", presupuesto ?? 0);
    }, [presupuesto]);
    
    // Se ejecuta cuando cambia gastos
    useEffect(() => {
        localStorage.setItem("gastos", JSON.stringify(gastos) ?? []);
        //console.log(JSON.stringify(gastos) ?? []);
    }, [gastos]);

    // Se ejecuta cuando carga la app
    useEffect(() => {
        const presupuestoLS = Number(localStorage.getItem("presupuesto")) ?? 0;

        if (presupuestoLS > 0) {
            setIsValidPresupuesto(true);
        }
    }, []);

    // Cambio de evento en el state filtro, si cambia, filtrar el arreglo de gastos
    useEffect(() => {
        if(filtro){
            // Filtrar gastos por categoria
            const gastosFiltrados = gastos.filter( gasto => gasto.categoria === filtro )
            //console.log(gastosFiltrados);
            setGastosFiltrados(gastosFiltrados)
        }
    }, [filtro])


    const handleNuevoGasto = () => {
        //console.log("Agregando nuevo gasto.. (modal)");
        setGastoEditar({});
        setModal(true);

        setTimeout(() => {
            setAnimarModal(true);
        }, 300);
    };

    const guardarGasto = (gasto) => {
        //console.log(gasto);
        //return; */

        if (gasto.id) {
            // Actualizar
            const gastosActualizados = gastos.map((gastoState) =>
                gastoState.id === gasto.id ? gasto : gastoState
            );
            setGastos(gastosActualizados);
            setGastoEditar({});
        } else {
            // Nuevo gasto
            gasto.id = generarId();
            gasto.fecha = Date.now();
            setGastos([...gastos, gasto]);
        }

        setAnimarModal(false);
        setTimeout(() => {
            setModal(false);
        }, 100);
    };

    const eliminarGasto = (id) => {
        //console.log("eliminando .. ", id);
        const gastosActualizados = gastos.filter((gasto) => gasto.id !== id);
        setGastos(gastosActualizados);
    };

    return (
        <div className={modal ? "fijar" : ""}>
            <Header
                gastos={gastos}
                setGastos={setGastos}
                presupuesto={presupuesto}
                setPresupuesto={setPresupuesto}
                isValidPresupuesto={isValidPresupuesto}
                setIsValidPresupuesto={setIsValidPresupuesto}
            />

            {isValidPresupuesto && (
                <>
                    <main>

                        <Filtros
                            filtro={filtro}
                            setFiltro={setFiltro}
                        />

                        <ListadoGastos
                            gastos={gastos}
                            setGastoEditar={setGastoEditar}
                            eliminarGasto={eliminarGasto}
                            filtro={filtro}
                            gastosFiltrados={gastosFiltrados}
                        />
                    </main>
                    <div className="nuevo-gasto">
                        <img
                            src={IconoNuevoGasto}
                            alt="Icono nuevo Gasto"
                            onClick={handleNuevoGasto}
                        />
                    </div>
                </>
            )}

            {modal && (
                <Modal
                    setModal={setModal}
                    animarModal={animarModal}
                    setAnimarModal={setAnimarModal}
                    guardarGasto={guardarGasto}
                    gastoEditar={gastoEditar}
                    setGastoEditar={setGastoEditar}
                />
            )}
        </div>
    );
}

export default App;
