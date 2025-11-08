import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export function LanzarAlerta(
  mensaje: string,
  icono: 'success' | 'error' | 'warning' | 'info' | 'question',
): void {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    background: '#00000',
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    },
  })
  Toast.fire({
    icon: icono,
    title: mensaje,
  })
}
