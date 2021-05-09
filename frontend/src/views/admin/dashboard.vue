<template>
	<div>
		<h1>Sos el admin bro</h1>
		<router-link :to="{ name: 'adminUsers' }">Usuarios</router-link>
		<router-link :to="{ name: 'adminRoles' }">Roles</router-link>
		<router-link :to="{ name: 'adminPermissions' }">Permisos</router-link>
	</div>
</template>

<script>
export default {

}
</script>

<style>

</style>