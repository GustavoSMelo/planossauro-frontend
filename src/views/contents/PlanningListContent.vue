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
                    <td>Serie A3</td>
                    <td>Epg Mauro roudao neto</td>
                    <td>Semanal</td>
                    <td>10/10/2010 ~ 10/10/2010</td>
                    <td class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td class="btnCellRemove"><i class="pi pi-trash"></i></td>
                </tr>
                <tr>
                    <td data-cell="serie">Serie A3</td>
                    <td data-cell="escola">Epg Mauro roudao neto</td>
                    <td data-cell="tipo planj.">Semanal</td>
                    <td data-cell="data planj.">10/10/2010 ~ 10/10/2010</td>
                    <td class="btnCellEdit"><i class="pi pi-pencil"></i></td>
                    <td class="btnCellRemove"><i class="pi pi-trash"></i></td>
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
