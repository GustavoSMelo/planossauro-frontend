<script setup lang="ts">
</script>

<template>
    <form class="searchFormContainer">
        <span>
            <label>Data de planejamento: </label>
            <input type="date" />
        </span>
        <span>
            <label>Classe/serie: </label>
            <input type="text" placeholder="insira a classe/serie" />
        </span>
        <span>
            <label>Tipo do planejamento: </label>
            <select>
                <option>Semanal</option>
                <option>Diario</option>
            </select>
        </span>

        <button type="button">Buscar</button>
    </form>
    <section class="listingContainer">
        <table>
            <thead>
                <tr>
                    <th>Serie/classe</th>
                    <th>Escola</th>
                    <th>Tipo do plan.</th>
                    <th>Data</th>
                    <th>Editar</th>
                    <th>Remover</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-cell="Serie: ">Serie A3</td>
                    <td data-cell="Escola: ">Epg Mauro roudao neto</td>
                    <td data-cell="Tipo planejamento: ">Semanal</td>
                    <td data-cell="Data planejamento: ">10/10/2010 ~ 10/10/2010</td>
                    <td data-cell="Editar: " class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td data-cell="Editar: " class="btnCellRemove"><i class="pi pi-trash"></i></td>
                </tr>
                <tr>
                    <td data-cell="Serie: ">Serie A3</td>
                    <td data-cell="Escola: ">Epg Mauro roudao neto</td>
                    <td data-cell="Tipo planejamento: ">Semanal</td>
                    <td data-cell="Data planejamento: ">10/10/2010 ~ 10/10/2010</td>
                    <td data-cell="Editar: " class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td data-cell="Editar: " class="btnCellRemove"><i class="pi pi-trash"></i></td>
                </tr>

                <tr>
                    <td data-cell="Serie: ">Serie A3</td>
                    <td data-cell="Escola: ">Epg Mauro roudao neto</td>
                    <td data-cell="Tipo planejamento: ">Semanal</td>
                    <td data-cell="Data planejamento: ">10/10/2010 ~ 10/10/2010</td>
                    <td data-cell="Editar: " class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td data-cell="Editar: " class="btnCellRemove"><i class="pi pi-trash"></i></td>
                </tr>

                <tr>
                    <td data-cell="Serie: ">Serie A3</td>
                    <td data-cell="Escola: ">Epg Mauro roudao neto</td>
                    <td data-cell="Tipo planejamento: ">Semanal</td>
                    <td data-cell="Data planejamento: ">10/10/2010 ~ 10/10/2010</td>
                    <td data-cell="Editar: " class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td data-cell="Editar: " class="btnCellRemove"><i class="pi pi-trash"></i></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6">Carregar mais planejamentos</td>
                </tr>
            </tfoot>
        </table>
    </section>
</template>

<style lang="scss" scoped src="../../styles/contents/planninglistcontent.style.scss" />
