<template>
  <div class="main-user">
    <div class="user-name">{{ user.name }}</div>
    <div class="user-info">
      <span class="user-email">{{ user.email }}</span>
      <span class="user-role">
        {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
      </span>
      <v-icon
        class="icon-role"
        :name="
          user.role === 'admin' ? 'md-adminpanelsettings-outlined' : 'fa-user'
        "
      ></v-icon>

      <div class="dropdown">
        <v-icon
          data-bs-toggle="dropdown"
          aria-expanded="false"
          class="icon-options"
          name="co-options"
        />

        <ul class="dropdown-menu">
          <li>
            <button
              :disabled="
                user.email === this.myEmail || !this.myPermissions.remove
              "
              class="itens-menu"
              @click="deleteUser(user._id)"
            >
              <span>Excluir</span>
              <v-icon name="bi-trash-fill"></v-icon>
            </button>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button
              :disabled="
                user.email === this.myEmail || !this.myPermissions.update_user
              "
              class="itens-menu"
              data-bs-toggle="modal"
              :data-bs-target="'#' + user._id.replace(/[^a-zA-Z]/g, '')"
              @click="openModal(user)"
            >
              <span>Mudar Permissão</span>
              <v-icon name="la-user-edit-solid"></v-icon>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    :id="user._id.replace(/[^a-zA-Z]/g, '')"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            Alterar Permissão
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3 row">
            <label class="col-sm-2 col-form-label">Usuário</label>
            <div class="col-sm-10">
              <input
                type="text"
                readonly
                class="form-control-plaintext"
                :value="user_editing.name"
              />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="inputRole" class="col-sm-2 col-form-label"
              >Função</label
            >
            <div class="col-sm-10">
              <select
                id="inputRole"
                class="form-select"
                v-model="user_editing.role"
              >
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="permissions">
            <span class="label">Permissões</span>
            <div class="itens-permissions">
              <div class="item-permission">
                <label for="register">Cadastrar</label>
                <input
                  v-model="user_editing.permissions.register"
                  id="register"
                  type="checkbox"
                />
              </div>
              <div class="item-permission">
                <label for="update">Editar</label>
                <input
                  v-model="user_editing.permissions.update_user"
                  id="update"
                  type="checkbox"
                />
              </div>
              <div class="item-permission">
                <label for="remove">Excluir</label>
                <input
                  v-model="user_editing.permissions.remove"
                  id="remove"
                  type="checkbox"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            id="close-modal"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            ref="cancelBtn"
            @click="closeModal()"
          >
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="save()">
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import axios from "axios";
import { toast } from "vue3-toastify";
import env from "../config/env.js";

export default {
  data() {
    return {
      user_editing: {
        _id: "",
        name: "",
        email: "",
        role: "",
        permissions: {
          register: false,
          update_user: false,
          remove: false,
        },
      },
    };
  },
  props: {
    user: {
      required: true,
    },
  },
  methods: {
    openModal(user) {
      this.user_editing = { ...user };
    },

    save() {
      const data = { ...this.user_editing };
      delete data.name;
      delete data.__v;
      delete data.password;
      axios
        .put(`${env.API_URL}/users/${data._id}`, data, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          toast("Permissão do usuário atualizada", {
            type: "success",
          });
          this.closeModal();
        })
        .catch((error) => {
          toast("Erro ao mudar a permissão do usuário: " + error.message, {
            type: "error",
          });
        });
    },

    deleteUser(id) {
      axios
        .delete(`${env.API_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          toast("Usuário excluido com sucesso", {
            type: "success",
          });
        })
        .catch((error) => {
          toast("Erro ao mudar a excluir usuário: " + error.message, {
            type: "error",
          });
        });
    },

    closeModal() {
      this.$refs.cancelBtn.click();

      this.user_editing.id = "";
      this.user_editing.name = "";
      this.user_editing.email = "";
      this.user_editing.role = "";
    },
  },
  computed: {
    myRole() {
      return this.$store.getters.getUserData.role;
    },
    myEmail() {
      return this.$store.getters.getUserData.email;
    },
    myPermissions() {
      return this.$store.getters.getUserData.permissions;
    },
  },
};
</script>

<style scoped lang="scss">
.main-user {
  height: 70px;
  width: calc(100% - 20px) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 10px;
  background: #009acc;
  color: #fff;
  border-radius: 10px;
  cursor: default;

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;

    .user-role {
      font-size: 25px;
    }

    .icon-role {
      height: 30px;
      width: 30px;
    }

    .icon-options {
      height: 30px;
      width: 30px;
      cursor: pointer;
      transition: all 0.5s;
    }
    .icon-options:hover {
      transform: scale(1.2);
    }

    .itens-menu {
      height: 40px;
      width: 100%;
      border: none;
      background: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      font-size: 16px;
      transition: all 0.5s;
      color: #009acc;

      user-select: none;
    }
    .itens-menu:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.permissions {
  .itens-permissions {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;

    .item-permission {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 6px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
}
</style>
