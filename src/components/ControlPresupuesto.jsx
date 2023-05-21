/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

const ControlPresupuesto = ({
    gastos,
    setGastos,
    presupuesto,
    setPresupuesto,
    setIsValidPresupuesto
}) => {
    const [disponible, setDisponible] = useState(0);
    const [gastado, setGastado] = useState(0);

    const [porcentaje, setPorcentaje] = useState(0);

    useEffect(() => {
        //console.log("Componente listo.");
        const totalGastado = gastos.reduce(
            (total, gasto) => gasto.cantidad + total,
            0
        );
        const totalDisponible = presupuesto - totalGastado;

        // Calcular porcentaje
        const nuevoPorcentaje = (
            ((presupuesto - totalDisponible) / presupuesto) *
            100
        ).toFixed(2);

        //console.log(totalGastado);
        setGastado(totalGastado);
        setDisponible(totalDisponible);

        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje);
        }, 300);
    }, [gastos]);

    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const handleResetApp = () => {
        console.log("Reseteando la app ...");
        const resultado = confirm("¿Deseas reiniciar presupuesto y gastos?")

        if(resultado){
            setGastos([])
            setPresupuesto(0)
            setIsValidPresupuesto(false)
        }
    }

    return (
        <div className="contenedor-presupuesto contenedor sombra dos-columnas">
            <div>
                <CircularProgressbar
                    value={porcentaje}
                    text={`${porcentaje}% Gastado`}
                    styles={buildStyles({
                        pathColor: porcentaje > 100 ? "#DC2626" : "#3B82F6",
                        textColor: porcentaje > 100 ? "#DC2626" : "#3B82F6",
                        trailColor: "#F5F5F5",
                    })}
                />
            </div>

            <div className="contenido-presupuesto">
                <button 
                    className="reset-app" 
                    type="button" 
                    onClick={handleResetApp}
                >
                    Resetear app
                </button>
                <p>
                    <span> Presupuesto: </span> {formatearCantidad(presupuesto)}
                </p>
                <p className={`${disponible < 0 ? "negativo" : ""}`}>
                    <span> Disponible: </span> {formatearCantidad(disponible)}
                </p>
                <p>
                    <span> Gastado: </span> {formatearCantidad(gastado)}
                </p>
            </div>
        </div>
    );
};

export default ControlPresupuesto;
