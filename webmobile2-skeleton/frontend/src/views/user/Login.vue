<template>
  <div class="user" id="login">
    <div class="wrapC">
      <h1>
        로그인을 하고 나면
        <br />
        좋은 일만 있을 거예요.
      </h1>

      <div class="input-with-label">
        <input v-model="email" v-bind:class="{ error: error.email, complete: !error.email && email.length !== 0 }" @keyup.enter="onLogin" id="email" placeholder="이메일을 입력하세요." type="text" />
        <label for="email">이메일</label>
        <div class="error-text" v-if="error.email">{{ error.email }}</div>
      </div>

      <div class="input-with-label">
        <input
          v-model="password"
          type="password"
          v-bind:class="{ error: error.password, complete: !error.password && password.length !== 0 }"
          id="password"
          @keyup.enter="onLogin"
          placeholder="비밀번호를 입력하세요."
        />
        <label for="password">비밀번호</label>
        <div class="error-text" v-if="error.password">{{ error.password }}</div>
      </div>

      <button class="btn btn--back btn--login" @click="onLogin" :disabled="!isSubmit" :class="{ disabled: !isSubmit }">로그인</button>

      <div class="sns-login">
        <div class="text">
          <p>SNS 간편 로그인</p>
          <div class="bar"></div>
        </div>
        <kakaoLogin :component="component" />
        <GoogleLogin :component="component" />
      </div>
      <div class="add-option">
        <div class="text">
          <p>혹시</p>
          <div class="bar"></div>
        </div>
        <div class="wrap">
          <p>비밀번호를 잊으셨나요?</p>
        </div>
        <div class="wrap">
          <p>아직 회원이 아니신가요?</p>
          <router-link to="/user/join" class="btn--text">가입하기</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../components/css/user.scss"
import PV from "password-validator"
import * as EmailValidator from "email-validator"
import KakaoLogin from "../../components/user/snsLogin/Kakao.vue"
import GoogleLogin from "../../components/user/snsLogin/Google.vue"
import UserApi from "../../api/UserApi"

export default {
  components: {
    KakaoLogin,
    GoogleLogin,
  },
  data() {
    return {
      email: "",
      password: "",
      passwordSchema: new PV(),
      error: {
        email: false,
        password: false,
      },
      isSubmit: false,
      component: this,
    }
  },
  created() {
    // 비밀번호 검증 스키마 설정
    this.passwordSchema.is().min(8).is().max(100).has().digits().has().letters()
  },
  watch: {
    email: "validateForm",
    password: "validateForm",
  },
  methods: {
    validateForm() {
      // 이메일 검증
      if (!this.email || !EmailValidator.validate(this.email)) {
        this.error.email = "이메일 형식이 올바르지 않습니다."
      } else {
        this.error.email = false
      }

      // 비밀번호 검증
      if (!this.password || !this.passwordSchema.validate(this.password)) {
        this.error.password = "비밀번호는 영문, 숫자를 포함한 8자리 이상이어야 합니다."
      } else {
        this.error.password = false
      }

      // 에러 상태를 기반으로 isSubmit 업데이트
      this.isSubmit = Object.values(this.error).every((err) => err === false)
    },
    onLogin() {
      if (!this.isSubmit) return

      const { email, password } = this
      const data = { email, password }

      // 요청 전 버튼 비활성화
      this.isSubmit = false

      UserApi.requestLogin(
        data,
        () => {
          // 요청 성공 처리
          this.isSubmit = true
          this.$router.push("/main")
        },
        () => {
          // 요청 실패 처리
          this.isSubmit = true
        }
      )
    },
  },
}
</script>
